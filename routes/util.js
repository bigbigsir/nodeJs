/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';
const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const router = express();
const pinyin = require('node-pinyin');
const JwtUtil = require('../token/index');

router.all('/*', (req, res, next) => {
    let data = req._data;
    let path = req._path.replace('/util').split('/').splice(1);
    let type = path.pop();
    let collection = path.shift();
    let options = {data, path};
    switch (type) {
        case 'getTest':
            return getTest(options, res);
        case 'getPublicKey':
            return getPublicKey(options, res);
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

// 获取中文拼音
function getPinYin(options, res) {
    let result;
    let {data, style} = options;
    let str = data.string;
    if (typeof str === 'string') {
        result = pinyin(str, {style});
        result = Array.prototype.concat.apply([], result);
        res.send({
            data: result,
            success: true
        });
    } else {
        return res.status(400).send('param has to be a string');
    }
}

// 获取公钥
function getPublicKey(options, res) {
    let publicKey = fs.readFileSync('./pem/rsa_public_key.pem').toString();
    res.send({
        key: publicKey,
        success: true
    })
}

function getTest(options, res) {
    let jwt = new JwtUtil(options.data.token);
    let data=jwt.verifyToken();
    console.log('data', data);
    res.send({
        data: data
    })
}

module.exports = router;
