/**
 * Created by: MoJie
 * Date: 2018/6/1
 * Time: 11:16
 * 路由
 */
'use strict';
const express = require('express');
const router = express.Router();
const baseDAO = require('../dao/baseDAO');
const multiparty = require('multiparty');
const fs = require('fs');
const util = require('util');
const pinyin = require("node-pinyin");
const http = require('http');
// 截取请求路径并调用对应的方法
router.all('/', function (req, res) {
    let param;
    let method = req.method.toUpperCase();
    let paths = req.baseUrl.split('/').slice(1);
    if (/\./.test(paths[paths.length - 1])) return sendError(res, req);
    if (method !== 'GET' && method !== 'POST') return res.send("ok");
    param = method === 'GET' ? req.query : req.body;
    if (Object.keys(param).length === 1 && Object.values(param)[0] === "") {
        if (/^\[.*\]$/.test(Object.keys(param)[0]) || /^\{.*\}$/.test(Object.keys(param)[0])) {
            param = JSON.parse(Object.keys(param)[0]);
        }
    }
    console.log('请求路径:\n', req.baseUrl, '<===>', paths);
    console.log('请求参数:\n', param);
    if (paths.length === 1) {
        switch (paths[0]) {
            case 'getIcon':
                getIcon(req, res);
                return;
            case 'login':
                paths.unshift("user");
                dataBase(req, res, paths, param);
                return;
            case 'logout':
                logout(req, res);
                break;
            case 'upload':
                upload(req, res, function (fields) {
                    dataBase(req, res, ['fileData', 'add'], fields);
                });
                break;
            case 'getPinYin':
                getPinYin(req, res, param, "normal");
                break;
            case 'getLetter':
                getPinYin(req, res, param, "firstLetter");
                break;
            case 'removeFile':
                removeFile(res, param, function (param) {
                    dataBase(req, res, ['fileData', 'removeFile'], param);
                });
                break;
            case 'getSession':
                getSession(req, res);
                break;
            default:
                sendError(res, req);
                break;
        }
    }
    else if (paths.length > 1) {
        let pop = paths[paths.length - 1];
        if (pop === 'upload') {
            paths.pop();
            upload(req, res, function (param) {
                param._id ? paths.push('update') : paths.push('add');
                dataBase(req, res, paths, param);
            });
        }
        else if (pop === 'removeFile') {
            removeFile(res, param, function (param) {
                dataBase(req, res, paths, param);
            });
        }
        else {
            dataBase(req, res, paths, param);
        }
    }
    else {
        sendError(res, req);
    }
    req.session.touch();// 刷新session的过期时间
});

// 获取阿里巴巴图标库项目
function getIcon(req, res) {
    let iconUrl = "http://at.alicdn.com/t/font_713843_tpypsb5dkl8.css";
    let content;
    http.get(iconUrl, function (response) {
        response.setEncoding('binary');  //二进制binary
        response.on('data', function (data) {    //加载到内存
            content = data;
            // console.log("================begin=================");
            // console.log(data);
            // console.log("=================end==================");
        }).on('end', function () {
            content = content.match(/el-icon-ump.+?:/g);
            if (content && content.length) {
                for (let i = content.length; i--;) {
                    content[i] = content[i].replace(/:/, "");
                }
            }
            return res.json({success: true, content: content});
        }).on("error", function (err) {
            return res.json({success: false, message: err.message});
        });
    })
}

// 上传文件方法
function upload(req, res, cb) {
    // 文件存放路径
    let savePath = 'public/file_store/';
    // 生成multiparty对象，并配置上传目标路径
    let form = new multiparty.Form({uploadDir: savePath, encoding: 'utf-8'});
    if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
    }
    // 设置单文件大小限制
    // form.maxFilesSize = 15 * 1024 * 1024;
    // 设置所有文件的大小总和
    // form.maxFields = 1000 * 1024 * 1024;
    // 上传完成后处理
    form.parse(req, function (err, fields, files) {
        for (let key in fields) {
            if (fields.hasOwnProperty(key)) {
                let value = fields[key][0];
                if (value && typeof value === "string" && value !== "[object Object]" && (/^\[.*\]$/.test(value) || /^\{.*\}$/.test(value))) {
                    value = JSON.parse(value);
                }
                fields[key] = value;
            }
        }
        console.log('表单其他参数：\n', fields);// 上传文件请求的其他参数
        if (err) {
            res.send({success: false, message: err});
            console.log('文件上传出错: ' + err);
        } else {
            console.log('上传的文件：\n', files);
            let fileList = [], fileName;
            for (let file in files) {
                if (files.hasOwnProperty(file)) {
                    for (let fileItem of files[file]) {
                        delete fileItem.headers;
                        fileName = fileItem.path.split('\\').pop();
                        fileItem.url = '/file_store/' + fileName;// 生成服务器地址
                        fileList.push(fileItem);
                    }
                }
            }
            if (Object.keys(fields).length) {
                fields.files = fileList;
            } else {
                fields = fileList;
            }
            res.header('content-type', 'text/plain;charset=UTF-8');
            cb(fields);
        }
    });
}

// 删除文件方法
function removeFile(res, param, cb) {
    if (!param.path) {
        return res.send({
            success: false,
            message: '删除文件路径参数（path）为空'
        });
    }
    typeof param.path === 'string' ? param.path = param.path.split(',') : null;
    for (let i = param.path.length; i--;) {
        if (fs.existsSync(param.path[i])) {
            fs.unlinkSync(param.path[i]);
        }
    }
    cb(param);
}

// 获取session
function getSession(req, res) {
    if (req.session.data && req.session.data.length) {
        baseDAO.reduce({
            param: {
                acc: req.session.data[0].code,
                pwd: req.session.data[0].pwd
            },
            paths: ["user"],
            operate: "login",
            cb: function (data) {
                if (data.success && data.content.length) {
                    delete data.content[0].pwd;
                    res.send({success: true, content: data.content});
                } else {
                    res.send({success: true, content: []});
                }
            }
        });
    } else {
        res.send({success: true, content: []});
    }
}

// 清空session
function logout(req, res) {
    req.session.data = null;
    res.send({success: true, content: 1});
}

// 路由和数据库连接中间层方法，paths：请求路径，param：请求参数
function dataBase(req, res, paths, param) {
    let operate = paths.pop(); // 截取路径最后一段，作为操作类型
    baseDAO.reduce({
        cb,
        param,
        paths,
        operate
    });
    if (operate === "remove" && param) {

    }

    function cb(data) {
        if (operate === 'login' && data.success) {
            req.session.data = Array.isArray(data.content) ?
                data.content :
                [data.content];
        }
        res.json(data);
        console.log('返回数据:');
        console.log(data);
    }
}

// 路径错误返回方法
function sendError(res, req) {
    res.send({
        success: false,
        message: '请求的路径不正确:' + req.baseUrl
    });
    console.log('请求的路径不正确:\n', req.baseUrl);
}

// 获取中文拼音
function getPinYin(req, res, param, style) {
    let val = Object.values(param);
    let pinYin;
    if (val.length) {
        pinYin = pinyin(val[0], {
            style: style
        });
        pinYin = Array.prototype.concat.apply([], pinYin);
    } else {
        pinYin = []
    }
    res.send({
        success: true,
        content: pinYin
    });
}

module.exports = router;
