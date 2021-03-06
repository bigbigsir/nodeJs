require('colors')
const path = require('path')
const logger = require('morgan')
const express = require('express')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')
// const session = require('express-session')
const interfaces = require('os').networkInterfaces() // 在开发环境中获取局域网中的本机iP地址

// const config = require('./config')
const base = require('./routes/index')
const { router: api } = require('./routes/api')
const util = require('./routes/util')
const user = require('./routes/user')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// session
// app.use(session(config.sessionOps))

// routers
app.use('/*', base)
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

function init(port) {
  app.listen(port, () => {
    let iPAddress = ''
    for (const devName in interfaces) {
      if (Object.hasOwnProperty.call(interfaces, devName)) {
        interfaces[devName].forEach(alias => {
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            iPAddress = alias.address
          }
        })
      }
    }
    console.log(' App running at: ')
    console.log(' - Local:    ' + `http://localhost:${port}`.underline.green.bold)
    console.log(' - Network:  ' + `http://${iPAddress}:${port}`.underline.green.bold)
  })
}

module.exports = {
  init
}
