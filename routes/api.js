/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const fs = require('fs');
const express = require('express');
const db = require('../mongodb/connect');
const multiparty = require('multiparty');

const router = express();

router.all('/*', (req, res, next) => {
    let data = req._data;
    let path = req.params['0'].split('/');
    let type = path.pop();
    let collection = path.shift();
    let params = {data, path, collection};
    if (collection) {
        switch (type) {
            case "add":
                return insert(params, res);
            case "find":
                return find(params, res);
            case "findOne":
                return findOne(params, res);
            case "findPage":
                return findPage(params, res);
            case "updateOne":
                return updateOne(params, res);
            case "updateMany":
                return updateMany(params, res);
            case "remove":
                return remove(params, res);
            case "upload":
                return upload(params, req, res);
            case "removeFile":
                return removeFile(params, res);
            default:
                next();
        }
    } else {
        next();
    }
});

function find(params, res) {
    let ctrl = 'find';
    let param = {
        sort: {createTime: 1},
        projection: {password: 0}
    };
    let {data, collection} = params;
    let ops = {collection, ctrl, data, param};
    if (data.exact) {
        delete data.exact;
    } else {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'string' && key !== '_id') {
                    data[key] = {$regex: data[key]};
                } else if (Array.isArray(data[key])) {
                    data[key] = {$in: data[key]}
                }
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

function findOne(params, res) {
    let ctrl = 'findOne';
    let param = {
        projection: {password: 0}
    };
    let {data, collection} = params;
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

function findPage(params, res) {
    let getDataCtrl = 'find';
    let getTotalCtrl = 'countDocuments';
    let param = {
        sort: {createTime: 1},
        projection: {password: 0}
    };
    let {data, collection} = params;
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

function insert(params, res) {
    let ctrl = 'insertMany';
    let {data, collection} = params;
    let ops = {collection, ctrl, data};
    if (!Array.isArray(ops.data)) ops.data = [ops.data];
    ops.data.forEach((item) => {
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

function updateOne(params, res) {
    let param;
    let ctrl = 'updateOne';
    let {data, collection} = params;
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

function updateMany(params, res) {
    let param;
    let ctrl = 'updateMany';
    let {data, collection} = params;
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

function remove(params, res) {
    let ctrl = 'deleteMany';
    let {data, collection} = params;
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

function upload(params, req, res) {
    let uploadDir = 'public/upload';
    let options = {
        uploadDir,
        encoding: 'utf-8',
        maxFields: 1000,
        autoFiles: true,
        autoFields: true,
        maxFilesSize: Infinity,
        maxFieldsSize: 1024 * 1024 * 2
    };
    let form = new multiparty.Form(options);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    form.parse(req, (err, fields, files) => {
        let fileList = [];
        if (err) return res.status(403).send({msg: err});
        for (let key in fields) {
            if (fields.hasOwnProperty(key)) fields[key] = fields[key].join();
        }
        for (let key in files) {
            if (files.hasOwnProperty(key)) {
                files[key].forEach((item) => {
                    if (item.originalFilename) {
                        fileList.push({
                            path: item.path,
                            size: item.size,
                            fieldName: item.fieldName,
                            name: item.originalFilename,
                            url: '/upload/' + item.path.split('\\').pop(),
                        });
                    } else {
                        fs.unlink(item.path, () => {
                        });
                    }
                })
            }
        }
        if (fileList.length) {
            if (Object.keys(fields).length) {
                fields.files = fileList;
                params.data = fields;
            } else {
                params.data = fileList;
            }
            insert(params, res);
        } else {
            res.status(400).send('Upload file is empty');
        }
    });
}

function removeFile(params, res) {
    let ctrl = 'find';
    let {data, collection} = params;
    let ops = {collection, ctrl, data};
    if (data._id) {
        if (Array.isArray(data._id)) {
            data._id = {$in: data._id}
        }
    } else {
        return res.status(400).send('_id is undefined')
    }
    db.connect(ops).then((data) => {
        data.forEach((item) => {
            if (item.files && item.files.length) {
                item.files.forEach((item) => {
                    fs.unlink(item.path, () => {
                    });
                })
            } else {
                fs.unlink(item.path, () => {
                });
            }
        });
        remove(params, res);
    }, () => {
        res.status(400).end();
    });
}

module.exports = router;