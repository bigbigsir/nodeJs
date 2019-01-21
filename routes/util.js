/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const express = require('express');
const router = express();
const pinyin = require('node-pinyin');

router.all('/*', (req, res, next) => {
    let data = req._data;
    let path = req._path.replace('/util').split('/').splice(1);
    let type = path.pop();
    let collection = path.shift();
    let options = {data, path};
    switch (type) {
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

module.exports = router;
