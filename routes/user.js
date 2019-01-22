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

function signIn(options, res) {
    let {data, collection} = options;
    let ctrl = 'findOne';
    let pwd = data.password;
    delete data.password;
    let ops = {collection, ctrl, data};
    db.connect(ops).then((data) => {
        if (data && data.password === generateHmac(decrypt(pwd))) {
            let token = jwt.generateToken(data._id);
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
                token: null
            });
        }
    }, () => {
        res.sendStatus(400);
    }).catch((err) => {
        res.sendStatus(400);
        console.log('login catch:', err);
    });
}

function signUp(options, res) {
    let {data, collection} = options;
    let ctrl = 'insertOne';
    let ops = {collection, ctrl, data};
    try {
        data.password = generateHmac(decrypt(data.password));
    } catch (e) {
        return res.sendStatus(400);
    }
    data._id = db.ObjectID().toString();
    data._createTime = +new Date();
    db.connect(ops).then((data) => {
        res.send({
            data,
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

function signOut(options, res) {
    res.clearCookie('token');
    res.send({
        success:true,
        msg:'退出成功'
    })
}

// 私钥解密
function decrypt(key) {
    let privateKey = fs.readFileSync('./pem/rsa_private_key.pem').toString();
    let buffer = Buffer.from(key, 'base64');
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