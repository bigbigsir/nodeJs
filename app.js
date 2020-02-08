require('colors')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const compression = require('compression')
const interfaces = require('os').networkInterfaces() // 在开发环境中获取局域网中的本机iP地址
const cp = require('child_process')
const history = require('connect-history-api-fallback')

const config = require('./config')
const index = require('./routes/index')
const { router: api } = require('./routes/api')
const util = require('./routes/util')
const user = require('./routes/user')

const app = express()
app.use('/', history({
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
  rewrites: [
    {
      from: /^\/admin/,
      to: function (context) {
        return '/admin/index.html'
      }
    },
    {
      from: /^\/h5/,
      to: function (context) {
        return '/h5/index.html'
      }
    }
  ]
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

// 修改端口号后需要使用命令:node app启动服务
const server = app.listen(config.port, function () {
  let iPAddress = ''
  const port = server.address().port
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
  // cp.exec(`open http://${IPAddress}:${port}`)
})

module.exports = app
