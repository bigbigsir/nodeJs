/**
 * @description 登录/注册需要获取公钥加密后发送，密码字段不可逆加密保存到数据库
 * Created by: MoJie
 * Date: 2019/1/21
 */
'use strict';

const Fs = require('fs');
const Crypto = require('crypto');
const Express = require('express');
const Jwt = require('../common/token');
const DB = require('../mongodb/connect');

const Router = Express();

// 登录
function signIn(params, req, res) {
  let ctrl = 'findOne';
  let {data: query, collection} = params;
  let pwd = query.password;
  let options = {projection: {_id: 0}};
  if (!verifyCaptcha(params, req, res)) return;
  delete query.password;
  params = {collection, ctrl, ops: [query, options]};
  DB.connect(params).then((data) => {
    if (data && data.password === generateHmac(decrypt(pwd))) {
      let token = Jwt.generateToken(data.id);
      delete data.password;
      res.send({
        ok: 1,
        msg: '登录成功',
        token: token,
        user: data
      });
    } else {
      res.send({
        ok: 0,
        msg: '账号或者密码错误',
        token: null,
        user: null
      });
    }
  }, (err) => {
    res.status(400).read(err.toString());
  }).catch((err) => {
    res.status(400).send(err.toString);
    console.error('login catch:', err);
  });
}

// 注册
function signUp(params, req, res) {
  let ctrl = 'insertOne';
  let {data: doc, collection} = params;
  if (!verifyCaptcha(params, req, res)) return;
  try {
    doc.password = generateHmac(decrypt(doc.password));
  } catch (e) {
    return res.status(400).send(e);
  }
  doc.id = doc._id = DB.ObjectID().toString();
  doc.createTime = +new Date();
  params = {collection, ctrl, ops: [doc]};
  DB.connect(params).then(
    data => res.send(data),
    err => res.status(400).end(err)
  );
}

// 登出
function signOut(res) {
  res.send({
    ok: 1,
    msg: '退出成功'
  });
}

// 验证验证码
function verifyCaptcha(params, req, res) {
  let {data} = params;
  let captcha = data.captcha && data.captcha.toLowerCase();
  let sessionCaptcha = req.session.captcha && req.session.captcha.toLowerCase();
  delete data.captcha;
  if (sessionCaptcha || captcha) {
    if (!captcha) {
      res.send({ok: 0, msg: '请输入验证码'});
      return false;
    } else if (!sessionCaptcha) {
      res.send({ok: 0, msg: '验证码已过期，请重新输入'});
    } else if (sessionCaptcha !== captcha) {
      res.send({ok: 0, msg: '验证码错误，请重新输入'});
      return false;
    } else {
      return true;
    }
  } else {
    return true;
  }
}

// 获取当前登录用户信息
function getUserInfo(params, req, res) {
  let query;
  let ctrl = 'findOne';
  let {collection} = params;
  let options = {projection: {_id: 0, password: 0}};
  let token = req.cookies.token || req.headers.authorization;
  Jwt.verifyToken(token).then(({data}) => {
    query = {id: data};
    params = {collection, ctrl, ops: [query, options]};
    DB.connect(params).then(
      data => res.send(data),
      msg => res.status(400).send(msg)
    )
  }, () => {
    res.status(401).send({
      code: 401,
      msg: '授权无效或已过期，请重新登录'
    })
  })
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
  switch (type) {
    case 'signIn':
      return signIn(params, req, res);
    case 'signUp':
      return signUp(params, req, res);
    case 'signOut':
      return signOut(res);
    case 'getUserInfo':
      return getUserInfo(params, req, res);
    default:
      next();
  }
});

module.exports = Router;
