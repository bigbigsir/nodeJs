/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const express = require('express');
const router = express();
const db = require('../mongodb/connect');

router.all('/*', (req, res, next) => {
    let data = req._data;
    let path = req._path.replace('/api').split("/").splice(1);
    let type = path.pop();
    let collection = path.shift();
    let options = {data, path, collection};
    if (collection) {
        switch (type) {
            case "add":
                return insert(options, res);
            case "find":
                return find(options, res);
            case "findOne":
                return findOne(options, res);
            case "findPage":
                return findPage(options, res);
            case "updateOne":
                return updateOne(options, res);
            case "updateMany":
                return updateMany(options, res);
            case "remove":
                return remove(options, res);
            default:
                next();
        }
    } else {
        next();
    }
});

function find(options, res) {
    let ctrl = 'find';
    let param = {
        sort: {createTime: 1},
        projection: {pwd: 0}
    };
    let {data, collection} = options;
    let ops = {collection, ctrl, data, param};
    if (data.exact) {
        delete data.exact;
    } else {
        for (let key in data) {
            if (data.hasOwnProperty(key) && typeof data[key] === 'string' && key !== '_id') {
                data[key] = {
                    $regex: data[key]
                };
            }
        }
    }
    db.connect(ops).then((data) => {
        res.send({
            data,
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

function findOne(options, res) {
    let ctrl = 'findOne';
    let param = {
        sort: {createTime: 1},
        projection: {pwd: 0}
    };
    let {data, collection} = options;
    let ops = {collection, ctrl, data, param};
    db.connect(ops).then((data) => {
        res.send({
            data,
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

function findPage(options, res) {
    let getDataCtrl = 'find';
    let getTotalCtrl = 'countDocuments';
    let param = {
        sort: {createTime: 1},
        projection: {pwd: 0}
    };
    let {data, collection} = options;
    let {page, rows, pageSize, exact} = data;
    let getDataOps = {collection, ctrl: getDataCtrl, data, param};
    let getTotalOps = {collection, ctrl: getTotalCtrl, data};
    delete data.exact;
    delete data.page;
    delete data.rows;
    delete data.pageSize;
    page = parseInt(page);
    page = (page && page > 0) ? page : 1;
    pageSize = parseInt((pageSize || rows));
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10;
    param.limit = pageSize;
    param.skip = (page - 1) * pageSize;
    if (!exact) {
        for (let key in data) {
            if (data.hasOwnProperty(key) && typeof data[key] === 'string' && key !== "_id") {
                data[key] = {$regex: data[key]};
            }
        }
    }
    let getData = db.connect(getDataOps);
    let getTotal = db.connect(getTotalOps);
    Promise.all([getData, getTotal]).then((data) => {
        res.json({
            data: {
                page: page,
                pageSize: pageSize,
                total: data[1],
                maxPage: Math.ceil(data[1] / pageSize),
                rows: data[0]
            },
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

function insert(options, res) {
    let ctrl = 'insertMany';
    let {data, collection} = options;
    let ops = {collection, ctrl, data};
    if (!Array.isArray(ops.data)) ops.data = [ops.data];
    data.forEach((item) => {
        item._id = db.ObjectID().toString();
        item._createTime = +new Date();
    });
    db.connect(ops).then((data) => {
        res.send({
            data,
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

function updateOne(options, res) {
    let param;
    let ctrl = 'updateOne';
    let {data, collection} = options;
    if (data._id) {
        param = {$set: data};
        delete param._id;
        data = {_id: data._id};
    } else {
        return res.status(400).end();
    }
    let ops = {collection, ctrl, data, param};
    db.connect(ops).then((data) => {
        res.send({
            data,
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

function updateMany(options, res) {
    let param;
    let ctrl = 'updateMany';
    let {data, collection} = options;
    if ((data.filter instanceof Object) && (data.update instanceof Object)) {
        param = {$set: data.update};
        data = data.filter;
    } else {
        return res.status(400).end();
    }
    let ops = {collection, ctrl, data, param};
    db.connect(ops).then((data) => {
        res.send({
            data,
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

function remove(options, res) {
    let ctrl = 'deleteMany';
    let {data, collection} = options;
    let ops = {collection, ctrl, data};
    if (!Object.keys(data).length) return res.status(400).end();
    for (let key in data) {
        if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
            data[key] = {$in: data[key]}
        }
    }
    db.connect(ops).then((data) => {
        res.send({
            data,
            success: true
        });
    }, () => {
        res.status(400).end();
    });
}

module.exports = router;