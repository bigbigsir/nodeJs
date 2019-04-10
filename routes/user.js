/**
 * @description 登录/注册需要获取公钥加密后发送，密码字段不可逆加密保存到数据库
 * Created by: MoJie
 * Date: 2019/1/21
 */
'use strict';

require('colors');
const Fs = require('fs');
const Crypto = require('crypto');
const Express = require('express');
const CronJob = require('cron').CronJob;
const Jwt = require('../common/token');
const DB = require('../mongodb/connect');
const languages = require('../language');
const Router = Express();

let language;

const reduce = {
  // 登录
  signIn(req) {
    let ctrl = 'findOne';
    let {reqData: query, collection} = this.params;
    let password = query.password;
    let options = {projection: {_id: 0}};
    let params = {collection, ctrl, ops: [query, options]};
    delete query.password;
    return verifyCaptcha(query).then(() => {
      return DB.connect(params)
    }).then(data => {
      if (data && data.password === generateHmac(decrypt(password))) {
        let token = Jwt.generateToken(data.id);
        return {ok: 1, token}
      } else {
        return Promise.reject({ok: 0, msg: language['wrongPassword']})
      }
    });
  },
  // 注册
  signUp(req) {
    let ctrl = 'insertOne';
    let {reqData: doc, collection} = this.params;
    let captchaIsPass = verifyCaptcha(doc, req);
    let params = {collection, ctrl, ops: [doc]};
    if (captchaIsPass) return Promise.reject({ok: 0, msg: captchaIsPass});
    try {
      doc.password = generateHmac(decrypt(doc.password));
    } catch (err) {
      return Promise.reject(err);
    }
    doc.id = doc._id = DB.ObjectID().toString();
    doc.createTime = +new Date();
    return DB.connect(params);
  },
  // 登出
  signOut(req, res) {
    res.clearCookie('token');
    return Promise.resolve({ok: 1})
  },
  // 获取当前登录用户信息
  getUserInfo(req) {
    let ctrl = 'findOne';
    let {collection} = this.params;
    let options = {projection: {_id: 0, password: 0}};
    let token = req.cookies.token || req.headers.authorization;
    return Jwt.verifyToken(token).then(({data}) => {
      let query = {id: data};
      let params = {collection, ctrl, ops: [query, options]};
      return DB.connect(params)
    }, () => {
      return Promise.reject({
        ok: 0,
        code: 401,
        msg: language['tokenInvalid']
      })
    }).then(data => {
      return {ok: 1, data}
    })
  }
};

// 验证验证码
function verifyCaptcha(param) {
  let uuid = param.uuid;
  let captcha = param.captcha;
  if (!uuid && !captcha) return Promise.resolve(null);
  delete param.uuid;
  delete param.captcha;
  return DB.connect({
    ctrl: 'findOne',
    collection: '_captcha',
    ops: [{uuid, captcha}]
  }).then(data => {
    if (!data) {
      return Promise.reject({
        ok: 0,
        msg: language['wrongVerification']
      });
    } else if (data.createTime + 1000 * 60 < Date.now()) {
      return Promise.reject({
        ok: 0,
        msg: language['expiredVerification']
      });
    } else {
      DB.connect({
        ctrl: 'deleteOne',
        collection: '_captcha',
        ops: [{_id: data._id}]
      })
    }
  });
}

// 解密密文
function decrypt(cipherText) {
  if (cipherText.length < 30) return cipherText;
  let privateKey = Fs.readFileSync('./pem/rsa_private_key.pem').toString();
  let buffer = Buffer.from(cipherText, 'base64');
  let decrypted = Crypto.privateDecrypt({
    key: privateKey,
    padding: Crypto.constants.RSA_PKCS1_PADDING
  }, buffer);
  return decrypted.toString();
}

// Hmac加密
function generateHmac(str) {
  let privateKey = Fs.readFileSync('./pem/rsa_private_key.pem');
  let md5 = Crypto.createHmac('md5', privateKey);
  return md5.update(str).digest('hex');
}

Router.all('/*', (req, res, next) => {
  let reqData = req._requestParams;
  let path = req.url.replace(/(^\/)|(\?[\s\S]*)/g, '').split('/');
  let handle = path.pop();
  let collection = 'user';
  let params = {reqData, collection};
  language = languages[req._language] ? languages[req._language] : languages['zh-CN'];
  if (reduce.hasOwnProperty(handle)) {
    reduce.params = params;
    reduce[handle](req, res).then(data => {
      data.msg = 'success';
      res.send(data)
    }).catch(err => {
      if (err.ok !== undefined && err.msg !== undefined) {
        res.send(err);
      } else {
        res.send({ok: 0, msg: language['errorMsg'], error: err.toString()});
        console.log('User Route Error:\n'.red.bold, err, '\n');
      }
    })
  } else {
    next();
  }
});

module.exports = Router;

// 定时任务 每天04点0分0秒执行,清除验证码集合
new CronJob('0 0 4 * * *', function () {
  DB.connect({
    collection: 'captcha',
    ctrl: 'deleteMany',
    ops: [{}]
  });
}, null, true);
