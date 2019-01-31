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
    let data = (req.method === "GET") ? req.query : req.body;
    if (!(data instanceof Object)) data = Object.assign({}, data);
    req._data = data;
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

Router.all('/*', (req, res, next) => {
    setHeader(req, res);
    formatReqParam(req);
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else if (/^\/(util|user)/.test(req.baseUrl)) {
        next();
    } else {
        Jwt.verifyToken(req.cookies.token).then(() => next(), () => {
            res.status(401).send({
                ok: 0,
                status: 401,
                msg: 'token无效，请登录'
            })
        });
    }
});

module.exports = Router;
