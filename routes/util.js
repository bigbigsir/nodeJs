/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const Fs = require('fs');
const Express = require('express');
const Pinyin = require('node-pinyin');
const svgCaptcha = require('svg-captcha');
const DB = require('../mongodb/connect');
const languages = require('../language');

const Router = Express();

let language;

const reduce = {
  // 获取中文拼音
  getPinYin(req, style = 'normal') {
    let {reqData} = options;
    if (typeof reqData.text === 'string') {
      let data = Pinyin(reqData.text, {style});
      data = Array.prototype.concat.apply([], data);
      return Promise.resolve({data})
    } else {
      return Promise.reject('text has to be a string');
    }
  },
  // 获取首字母
  getFirstLetter(req) {
    return this.getPinYin(req, 'firstLetter')
  },
  // 获取公钥
  getPublicKey() {
    let key = Fs.readFileSync('./pem/rsa_public_key.pem').toString();
    return Promise.resolve({key});
  },
  // 生成图片验证码
  getCaptcha() {
    // create 生成随机验证码
    // createMathExpr 生成数学公式
    if (!this.params.reqData.uuid) return Promise.reject('uuid cannot be null');
    let captcha = svgCaptcha.createMathExpr({
      noise: 2,
      width: 120,
      height: 40,
      fontSize: 40,
      ignoreChars: '0o1ilI'
    });
    this.params.reqData = {
      createTime: Date.now(),
      uuid: this.params.reqData.uuid,
      captcha: captcha.text.toLowerCase()
    };
    return DB.connect({
      ctrl: 'insertOne',
      collection: '_captcha',
      ops: [this.params.reqData]
    }).then(() => captcha.data);
  }
};

Router.all('/*', (req, res, next) => {
  let reqData = req._requestParams;
  let path = req.url.replace(/(^\/)|(\?[\s\S]*)/g, '').split('/');
  let handle = path.pop();
  let params = {reqData, path};
  language = languages[req._language] ? languages[req._language] : languages['zh-CN'];
  if (reduce.hasOwnProperty(handle)) {
    reduce.params = params;
    reduce[handle](req).then(data => {
      if (handle === 'getCaptcha') return res.type('svg').send(data);
      data.ok = 1;
      data.msg = 'success';
      res.send(data)
    }).catch(err => {
      if (err.ok !== undefined && err.msg !== undefined) {
        res.send(err);
      } else {
        res.send({ok: 0, msg: language['errorMsg'], error: err.toString()});
        console.log('Util Route Error:\n'.red.bold, err, "\n");
      }
    });
  } else {
    next();
  }
});

module.exports = Router;
