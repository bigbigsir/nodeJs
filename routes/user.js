/**
 * @description 登录/注册需要获取公钥加密后发送，密码字段不可逆加加密保存到数据库
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
    let params = {data, collection};
    switch (type) {
        case 'signIn':
            return signIn(params, res);
        case 'signUp':
            return signUp(params, res);
        case 'signOut':
            return signOut(res);
        default:
            next();
    }
});

// 登录
function signIn(params, res) {
    let ctrl = 'findOne';
    let {data: query, collection} = params;
    let pwd = query.password;
    let options = {projection: {_id: 0}};
    delete query.password;
    params = {collection, ctrl, ops: [query, options]};
    db.connect(params).then((data) => {
        if (data && data.password === generateHmac(decrypt(pwd))) {
            let token = jwt.generateToken(data.id);
            delete data.password;
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24
            });
            res.send({
                ok: 1,
                msg: '登录成功',
                token: token,
                user: data
            });
        } else {
            res.send({
                ok: 1,
                msg: '账号或者密码错误',
                token: null,
                user: null
            });
        }
    }, (err) => {
        res.status(400).read(err);
    }).catch((err) => {
        res.status(400).send(err);
        console.error('login catch:', err);
    });
}

// 注册
function signUp(params, res) {
    let ctrl = 'insertOne';
    let {data: doc, collection} = params;
    try {
        doc.password = generateHmac(decrypt(doc.password));
    } catch (e) {
        return res.status(400).send(e);
    }
    doc.id = doc._id = db.ObjectID().toString();
    doc.createTime = +new Date();
    params = {collection, ctrl, ops: [doc]};
    db.connect(params).then(
        data => res.send(data),
        err => res.status(400).end(err)
    );
}

// 登出
function signOut(res) {
    res.clearCookie('token');
    res.send({
        ok: 1,
        msg: '退出成功'
    });
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