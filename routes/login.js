/**
 * Created by: MoJie
 * Date: 2019/1/21
 */
'use strict';

const express = require('express');
const router = express();
const JwtUtil = require('../token/index');
const db = require('../mongodb/connect');

router.all('/', (req, res, next) => {
    if (req.method === "POST") {
        let ctrl = 'findOne';
        let data = req._data;
        let collection = 'user';
        db.connect({
            data, ctrl, collection
        }).then((data) => {
            let _id = data._id.toString();
            // 将用户id传入并生成token
            let jwt = new JwtUtil(_id);
            let token = jwt.generateToken();
            // 将 token 返回给客户端
            res.send({status: 200, msg: '登陆成功', token: token});
        }, (err) => {
            res.send(err);
        });
    } else {
        res.status(405).send('login only allows POST method');
    }
});

module.exports = router;