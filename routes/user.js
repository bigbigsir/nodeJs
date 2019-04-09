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
const Jwt = require('../common/token');
const DB = require('../mongodb/connect');
const languages = require('../language');
const Router = Express();

let language;

const reduce = {
  // 登录
  signIn(req) {
    let ctrl = 'findOne';
    let {data: query, collection} = this.params;
    let password = query.password;
    let options = {projection: {_id: 0}};
    let params = {collection, ctrl, ops: [query, options]};
    let captchaIsPass = verifyCaptcha(query, req);
    delete query.password;
    if (captchaIsPass) return Promise.reject({ok: 0, msg: captchaIsPass});
    return DB.connect(params).then(data => {
      if (data && data.password === generateHmac(decrypt(password))) {
        let token = Jwt.generateToken(data.id);
        return {ok: 1, msg: 'success', token}
      } else {
        return Promise.reject({ok: 0, msg: language['wrongPassword']})
      }
    }).catch(err => {
      return Promise.reject(err)
    });
  },
  // 注册
  signUp(req) {
    let ctrl = 'insertOne';
    let {data: doc, collection} = this.params;
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
    return DB.connect(params).then(data => {
      return data
    }).catch(err => {
      return Promise.reject(err)
    });
  },
  // 登出
  signOut(req, res) {
    res.clearCookie('token');
    return Promise.resolve({
      ok: 1,
      msg: 'success'
    })
  },
  // 获取当前登录用户信息
  getUserInfo(req) {
    let ctrl = 'findOne';
    let {collection} = this.params;
    let options = {projection: {_id: 0, password: 0}};
    let token = req.cookies.token || req.headers.authorization;
    return Jwt.verifyToken(token).then(({userId}) => {
      let query = {id: userId};
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
      }
    ).catch(err => {
      return Promise.reject(err)
    })
  }
};

// 验证验证码
function verifyCaptcha(param, req) {
  let captcha = param.captcha && param.captcha.toLowerCase();
  let sessionCaptcha = req.session.captcha && req.session.captcha.toLowerCase();
  delete param.captcha;
  if (sessionCaptcha || captcha) {
    if (!captcha) {
      return language['enterVerification'];
    } else if (!sessionCaptcha) {
      return language['expiredVerification'];
    } else if (sessionCaptcha !== captcha) {
      return language['wrongVerification'];
    } else {
      return false;
    }
  } else {
    return false;
  }
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
  let data = req._data;
  let path = req.params['0'].split('/');
  let type = path.pop();
  let collection = 'user';
  let params = {data, collection};
  language = languages[req._language] ? languages[req._language] : languages['zh-CN'];
  if (reduce.hasOwnProperty(type)) {
    reduce.params = params;
    reduce[type](req, res).then(data => {
      res.send(data)
    }).catch(err => {
      if (err.ok !== undefined && err.msg !== undefined) {
        res.send(err);
      } else {
        res.send({ok: 0, msg: language['errorMsg'], error: err.toString()});
        console.log('reduce err:\n'.red, err, '\n');
      }
    })
  } else {
    next();
  }
});

module.exports = Router;
