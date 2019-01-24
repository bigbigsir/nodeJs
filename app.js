const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const chalk = require("chalk");

const config = require('./config');
const index = require('./routes/index');
const api = require('./routes/api1');
const util = require('./routes/util');
const user = require('./routes/user');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser('emoji'));
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session(config.sessionOps));

// routers
app.use('/*', index);
app.use('/api', api);
app.use('/util', util);
app.use('/user', user);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(config.port, config.host, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(chalk.green(`server address: http://${host}:${port}`));
});

module.exports = app;
