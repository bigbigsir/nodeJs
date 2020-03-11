require('colors')
const fs = require('fs')
const path = require('path')
const net = require('net')
const http = require('http')
const https = require('https')
const logger = require('morgan')
const express = require('express')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const compression = require('compression')
const interfaces = require('os').networkInterfaces() // 在开发环境中获取局域网中的本机iP地址
const history = require('connect-history-api-fallback')

const config = require('./config')
const index = require('./routes/index')
const { router: api } = require('./routes/api')
const util = require('./routes/util')
const user = require('./routes/user')

const privateKey = fs.readFileSync('./pem/3437218.key', 'utf8')
const certificate = fs.readFileSync('./pem/3437218.pem', 'utf8')
const credentials = {
  key: privateKey,
  cert: certificate
}

const app = express()
app.use('/', history({
  rewrites: [
    {
      from: /^\/admin/,
      to(context) {
        const reg = /^.+\.[a-z\d]+$/
        if (reg.test(context.parsedUrl.pathname)) {
          return context.parsedUrl.pathname
        }
        return '/h5/index.html'
      }
    },
    {
      from: /^\/h5/,
      to(context) {
        const reg = /^.+\.[a-z\d]+$/
        if (reg.test(context.parsedUrl.pathname)) {
          return context.parsedUrl.pathname
        }
        return '/h5/index.html'
      }
    }
  ],
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
}))
app.use(compression())
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// session
app.use(session(config.sessionOps))

// routers
app.use('/*', index)
app.use('/api', api)
app.use('/util', util)
app.use('/user', user)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

function init(port, httpPort, httpsPort) {
  // 监听https http 端口
  http.createServer(app).listen(httpPort)
  https.createServer(credentials, app).listen(httpsPort)
  // 创建服务器
  net.createServer(socket => {
    socket.once('data', (buf) => {
      // buf 返回格式数组，如果https访问，buf[0]为十六进制
      // https数据流的第一位是十六进制 “16” ，转换成十进制就是22
      const address = buf[0] === 22 ? httpsPort : httpPort
      // 创建指向https或http服务器的链接
      const proxy = net.createConnection(address, () => {
        proxy.write(buf)
        // 反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
        socket.pipe(proxy).pipe(socket)
      })
      proxy.on('error', (err) => {
        console.log(err)
      })
    })
    socket.on('error', (err) => {
      console.log(err)
    })
  }, app).listen(port, () => {
    let iPAddress = ''
    for (const devName in interfaces) {
      interfaces[devName].forEach(alias => {
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          iPAddress = alias.address
        }
      })
    }
    console.log(' App running at: ')
    console.log(' - Local:    ' + `http://localhost:${port}`.underline.green.bold)
    console.log(' - Network:  ' + `http://${iPAddress}:${port}`.underline.green.bold)
  })

  // const server = app.listen(port, () => {
  //   let iPAddress = ''
  //   const port = server.address().port
  //   for (const devName in interfaces) {
  //     interfaces[devName].forEach(alias => {
  //       if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
  //         iPAddress = alias.address
  //       }
  //     })
  //   }
  //   console.log(' App running at: ')
  //   console.log(' - Local:    ' + `http://localhost:${port}`.underline.green.bold)
  //   console.log(' - Network:  ' + `http://${iPAddress}:${port}`.underline.green.bold)
  //   // cp.exec(`open http://${IPAddress}:${port}`)
  // })
}

module.exports = {
  init
}
