/**
 * Created by: MoJie
 * Date: 2019/1/21
 */
'use strict';

const fs = require('fs');
const crypto = require('crypto');
const express = require('express');
const jwt = require('../common/token');
const db = require('../mongodb/connect');
const router = express();

router.all('/*', (req, res, next) => {
    let data = req._data;
    let path = req.params['0'].split('/');
    let type = path.pop();
    let collection = 'user';
    let options = {data, collection};
    switch (type) {
        case 'signIn':
            return signIn(options, res);
        case 'signUp':
            return signUp(options, res);
        case 'signOut':
            return signOut(options, res);
        default:
            next();
    }
});

// 登录
function signIn(options, res) {
    let {data, collection} = options;
    let ctrl = 'findOne';
    let pwd = data.password;
    let param = {projection: {_id: 0}};
    let ops = {collection, ctrl, data, param};
    delete data.password;
    db.connect(ops).then((data) => {
        if (data && data.password === generateHmac(decrypt(pwd))) {
            let token = jwt.generateToken(data.id);
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24
            });
            res.send({
                success: true,
                msg: '登录成功',
                token: token,
                user: data
            });
        } else {
            res.send({
                success: false,
                msg: '账号或者密码错误',
                token: null,
                user: null
            });
        }
    }, () => {
        res.sendStatus(400);
    }).catch((err) => {
        res.sendStatus(400);
        console.log('login catch:', err);
    });
}

// 注册
function signUp(options, res) {
    let {data, collection} = options;
    let ctrl = 'insertOne';
    let ops = {collection, ctrl, data};
    try {
        data.password = generateHmac(decrypt(data.password));
    } catch (e) {
        return res.sendStatus(400);
    }
    data.id = data._id = db.ObjectID().toString();
    data.createTime = +new Date();
    db.connect(ops).then((data) => {
        res.send({
            data,
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

// 登出
function signOut(options, res) {
    res.clearCookie('token');
    res.send({
        success: true,
        msg: '退出成功'
    })
}

// 解密密文
function decrypt(cipherText) {
    let privateKey = fs.readFileSync('./pem/rsa_private_key.pem').toString();
    let buffer = Buffer.from(cipherText, 'base64');
    let decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    return decrypted.toString();
}

// Hmac加密
function generateHmac(str) {
    let privateKey = fs.readFileSync('./pem/rsa_private_key.pem');
    let md5 = crypto.createHmac('md5', privateKey);
    return md5.update(str).digest('hex');
}

module.exports = router;