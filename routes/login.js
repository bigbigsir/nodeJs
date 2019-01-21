/**
 * Created by: MoJie
 * Date: 2019/1/21
 */
'use strict';

const express = require('express');
const router = express();
const JwtUtil = require('../token/index');
const db = require('../mongodb/connect');

const NodeRSA = require('node-rsa');
const fs = require('fs');
const crypto = require('crypto');

function decrypt(key) {
    let privateKey = fs.readFileSync('./pem/rsa_private_key.pem').toString();
    let buffer = Buffer.from(key, 'base64');
    let decrypted = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING
    }, buffer);
    return decrypted.toString();
}

router.all('/', (req, res, next) => {
    if (req.method === "POST") {
        let ctrl = 'findOne';
        let data = req._data;
        let collection = 'user';
        let pwd = data.pwd;
        delete data.pwd;
        console.log('pwd',pwd);
        console.log(decrypt(pwd));
        db.connect({
            data, ctrl, collection
        }).then((data) => {
            if (data.pwd === decrypt(pwd)) {
                let _id = data._id;
                // 将用户id传入并生成token
                let jwt = new JwtUtil(_id);
                let token = jwt.generateToken();
                // 将 token 返回给客户端
                res.send({success: true, token: token});
            } else {
                res.code.send({success: false, msg:'账号或者密码错误'});
            }

        }, (err) => {
            res.send(err);
        });
    } else {
        res.status(405).send('login only allows POST method');
    }
});

module.exports = router;