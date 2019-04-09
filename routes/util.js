/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const Fs = require('fs');
const Express = require('express');
const Pinyin = require('node-pinyin');
const svgCaptcha = require('svg-captcha');

const Router = Express();

// 获取中文拼音
function getPinYin(options, res) {
  let result;
  let {data, style} = options;
  let str = data.string;
  if (typeof str === 'string') {
    result = Pinyin(str, {style});
    result = Array.prototype.concat.apply([], result);
    res.send({
      data: result,
      ok: 1
    });
  } else {
    return res.status(400).send('param has to be a string');
  }
}

// 获取公钥
function getPublicKey(options, res) {
  let publicKey = Fs.readFileSync('./pem/rsa_public_key.pem').toString();
  res.send({
    key: publicKey,
    ok: 1
  });
}

// 生成图片验证码
function getCaptcha(res, req) {
  // create 生成随机验证码
  // createMathExpr 生成数学公式
  let captcha = svgCaptcha.createMathExpr({
    noise: 2,
    width: 120,
    height: 40,
    fontSize: 40,
    ignoreChars: '0o1ilI'
  });
  req.session.captcha = captcha.text;
  res.type('svg').send(captcha.data);
}

Router.all('/*', (req, res, next) => {
  let data = req._data;
  let path = req.params['0'].split('/');
  let type = path.pop();
  let options = {data, path};
  switch (type) {
    case 'getPublicKey':
      return getPublicKey(options, res);
    case 'getCaptcha':
      return getCaptcha(res, req);
    case 'getPinYin':
      options.style = 'normal';
      return getPinYin(options, res);
    case 'getFirstLetter':
      options.style = 'firstLetter';
      return getPinYin(options, res);
    default:
      next();
  }
});

module.exports = Router;
