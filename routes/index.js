/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

require('colors');
const Express = require('express');
const Jwt = require('../common/token');
const languages = require('../language');
const Router = Express();

// 处理请求参数
function formatReqParam(req) {
  let data = null;
  let {query, body} = req;
  if (Array.isArray(body)) {
    data = body
  } else {
    data = Object.assign({}, query, body);
  }
  delete data._;
  req._requestParams = data;
  req._language = req.headers['accept-language'] || 'zh-CN';
  console.log('Request Params:\n'.underline.green.bold, data, '\n')
}

// 请求头/跨域设置
function setHeader(req, res) {
  let {origin, Origin, referer, Referer} = req.headers;
  let allowOrigin = origin || Origin || referer || Referer || '*';
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); // 是否可以带cookies
  res.header("X-Powered-By", 'Express');
}

// 接口权限认证
function authorization(req, res, next) {
  let token;
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  formatReqParam(req);
  if (/^\/(util|user)/.test(req.baseUrl)) {
    next();
  } else {
    let language = languages[req._language] ? languages[req._language] : languages['zh-CN'];
    token = req.cookies.token || req.headers.authorization;
    Jwt.verifyToken(token).then(() => next(), () => {
      res.status(401).send({
        ok: 0,
        code: 401,
        msg: language['tokenInvalid']
      })
    });
  }
}

Router.all('/*', (req, res, next) => {
  console.log(req.ip);
  setHeader(req, res);
  authorization(req, res, next);
});

module.exports = Router;
