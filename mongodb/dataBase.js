'use strict';
/**
 * Created by: MoJie
 * Date: 2018/6/1
 * Time: 11:16
 * 数据处理层
 * 连接数据库并传入所需的参数执行相应的collection操作，执行回调返回操作结果。
 */
// const async = require("async");
// const assert = require('assert');
// const mongoose = require('mongoose');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const url = 'mongodb://127.0.0.1:27017/exploit';

// 数据库操作方法，根据数据库操作键调用对应的方法
function collection(options) {
    switch (options.ctrl) {
        case 'find':
            connect(options, dbQueryCtrl);
            break;
        case 'findPage':
            options.ctrl = 'find';
            connect(options, dbQueryPageCtrl);
            break;
        case 'insert':
            connect(options, dbCtrl);
            break;
        case 'update':
            connect(options, dbCtrl);
            break;
        case 'recursion':
            options.ctrl = 'find';
            connect(options, dbRecursionQueryCtrl);
            break;
        case 'deleteMany':
            connect(options, dbCtrl);
            break;
        case 'lookup':
            options.ctrl = 'aggregate';
            connect(options, dbJoinQueryCtrl);
            break;
    }
}

// 查找方法
function dbQueryCtrl(options) {
    let {client, col, ctrl, params, cb} = options;
    col[ctrl](...params).toArray(function (err, data) {
        client.close();
        if (err) return cb('数据查找失败/' + err);
        data = params[0]._id ? data[0] : data;
        cb(data);
    });
}

// 分页查找方法
function dbQueryPageCtrl(options) {
    let {client, col, ctrl, params, cb} = options;
    let {page, pageSize, param} = params;
    col[ctrl](...param).toArray(function (err, data) {
        client.close();
        if (err) return cb('数据查找失败/' + err);
        data = {
            page: page--,
            pageSize: pageSize,
            total: data.length,
            maxPage: Math.ceil(data.length / pageSize),
            rows: data.splice(page * pageSize, pageSize)
        };
        cb(data);
    });
}

// 关联查找方法
function dbJoinQueryCtrl(options) {
    let {client, col, ctrl, params, cb} = options;
    col[ctrl](params).toArray(function (err, data) {
        client.close();
        if (err) return cb('数据查找失败/' + err);
        data.length ? cb(...data) : cb(data);
    });
}

// 新增、编辑、删除共用方法
function dbCtrl(options) {
    let {client, col, ctrl, params, cb} = options;
    col[ctrl](...params, function (err, data) {
        client.close();
        if (err) return cb('数据操作失败/' + err);
        if (ctrl === 'insert') {
            cb(data.ops);
        } else {
            cb(data.result.n);
        }
    });
}

// 递归查找方法
function dbRecursionQueryCtrl(options) {
    let {client, col, ctrl, params, cb} = options;
    let getRoot = new Promise(function (resolve, reject) {
        col[ctrl](...params).toArray(function (err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
    let getAll = new Promise(function (resolve, reject) {
        col[ctrl]().sort({sort: -1}).toArray(function (err, data) {
            if (err) reject(err);
            else resolve(data);
        });
    });
    Promise.all([getRoot, getAll]).then(
        function fulfilled(vals) {
            client.close();
            vals[0].forEach(function (root) {
                recursion(root, vals[1])
            });
            cb(vals[0]);
        },
        function rejected(reason) {
            client.close();
            cb('数据查找失败/' + reason);
        },
    );

    function recursion(node, data) {
        node.children = [];
        for (let i = data.length; i--;) {
            if (data[i] && node._id === data[i]._parentId) {
                node.children.push(data[i]);
                data.splice(i, 1);
                recursion(node.children[node.children.length - 1], data);
            }
        }
    }
}

// 连接数据库
function connect(options, fn) {
    console.log('操作mongodb的参数:\n', JSON.stringify(options));
    let {collection, ctrl, params, func} = options;
    MongoClient.connect(url).then(
        function (client) {
            let db = client.db('exploit');
            let col = db.collection(collection);
            fn({client, col, ctrl, params, cb: formatData});
        },
        function (err) {
            formatData('数据库连接出错/' + err);
        }
    );

    function formatData(data) {
        if (typeof data === "string" && /数据/.test(data)) {
            func(error(data));
        } else {
            func(success(data));
        }
    }
}

// 错误信息格式化
function error(msg) {
    console.log(msg);
    return {
        success: false,
        message: msg
    };
}

// 成功数据格式化
function success(data) {
    return {
        success: true,
        content: data
    };
}

module.exports = {
    collection,
    ObjectID,
    success,
    error
};

function testFunc() {
    MongoClient.connect(url).then(
        function (client) {
            let db = client.db('exploit');
            let col = db.collection('user');
            col['find']({}).toArray(function (err, data) {
                client.close();
                if (err) throw '数据查找失败/' + err;
                console.log(data);
            })
        },
        function (err) {
            throw '数据库连接出错/' + err;
        }
    );
}
