/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const express = require('express');
const router = express();

router.all('/*', (req, res, next) => {
    setHeader(req, res);
    formatReqParam(req);
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// 处理请求参数
function formatReqParam(req) {
    let data = (req.method === "GET") ? req.query : req.body;
    if (!(data instanceof Object)) data = Object.assign({}, data);
    if (req.method === "GET" && Object.keys(data).length === 1 && Object.values(data)[0] === "") {
        if (/^\[.*\]$/.test(Object.keys(data)[0]) || /^\{.*\}$/.test(Object.keys(data)[0])) {
            data = JSON.parse(Object.keys(data)[0]);
        }
    }
    req._data = data;
    req._path = req.baseUrl;
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
