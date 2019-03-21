/**
 * Created by: MoJie
 * Date: 2019/1/15
 */

const Config = {
  host: '127.0.0.1',
  port: 3000,
  sessionOps: {
    name: 'express-session',
    secret: 'emoji',
    cookie: {
      maxAge: 2 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
  },
  dbUrl: 'mongodb://127.0.0.1:27017/node',
  dbName: 'node',
  dbOptions: {useNewUrlParser: true}
};

module.exports = Config;
