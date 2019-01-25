/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const express = require('express');
const jwt = require('../common/token');
const router = express();

router.all('/*', (req, res, next) => {
    setHeader(req, res);
    formatReqParam(req);
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else if (/^\/(util|user)/.test(req.baseUrl)) {
        next();
    }
    else {
        jwt.verifyToken(req.cookies.token).then(() => next(), () => {
            res.status(401).send({
                ok: 0,
                status: 401,
                msg: 'token无效，请登录'
            })
        });
    }
});

// 处理请求参数
function formatReqParam(req) {
    let data = (req.method === "GET") ? req.query : req.body;
    if (!(data instanceof Object)) data = Object.assign({}, data);
    req._data = data;
}

// 跨域设置
function setHeader(req, res) {
    const {origin, Origin, referer, Referer} = req.headers;
    const allowOrigin = origin || Origin || referer || Referer || '*';
    res.header("Access-Control-Allow-Origin", allowOrigin);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); // 可以带cookies
    res.header("X-Powered-By", 'Express');
}

module.exports = router;
