/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const Express = require('express');
const Jwt = require('../common/token');
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
  req._data = data;
}

// 请求头/跨域设置
function setHeader(req, res) {
  let {origin, Origin, referer, Referer} = req.headers;
  let allowOrigin = origin || Origin || referer || Referer || '*';
  res.header("Access-Control-Allow-Origin", allowOrigin);
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Language");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); // 是否可以带cookies
  res.header("X-Powered-By", 'Express');
}

// 接口权限认证
function authorization(req, res, next) {
  let token;
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else if (/^\/(util|user)/.test(req.baseUrl)) {
    next();
  } else {
    token = req.cookies.token || req.headers.authorization;
    Jwt.verifyToken(token).then(() => next(), () => {
      res.status(401).send({
        ok: 0,
        code: 401,
        msg: '授权无效或已过期，请重新登录'
      })
    });
  }
}

Router.all('/*', (req, res, next) => {
  setHeader(req, res);
  formatReqParam(req);
  authorization(req, res, next);
});

module.exports = Router;
