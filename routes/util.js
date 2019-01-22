/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const fs = require('fs');
const express = require('express');
const pinyin = require('node-pinyin');
const router = express();

router.all('/*', (req, res, next) => {
    let data = req._data;
    let path = req.params['0'].split('/');
    let type = path.pop();
    let collection = path.shift();
    let options = {data, path};
    switch (type) {
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
    });
}

module.exports = router;
