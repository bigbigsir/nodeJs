/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

const fs = require('fs');
const _util = require('../common/util');
const express = require('express');
const db = require('../mongodb/connect');
const multiparty = require('multiparty');
const router = express();

const reduce = {
    find() {
        let {
            data,
            collection
        } = this.params;
        let ctrl = 'find';
        let param = {
            sort: {createTime: 1},
            projection: {password: 0, _id: 0}
        };
        let params = {collection, ctrl, data, param};
        if (data.exact) {
            delete data.exact;
        } else {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    if (typeof data[key] === 'string' && key !== 'id') {
                        data[key] = {$regex: data[key]};
                    } else if (Array.isArray(data[key])) {
                        data[key] = {$in: data[key]}
                    }
                }
            }
        }
        return new Promise((resolve, reject) => {
            db.connect(params).then((data) => resolve({
                ok: 1, data
            }), reject);
        });
    },
    findOne() {
        let {
            data,
            collection
        } = this.params;
        let ctrl = 'findOne';
        let param = {
            projection: {password: 0, _id: 0}
        };
        let params = {collection, ctrl, data, param};
        return new Promise((resolve, reject) => {
            db.connect(params).then(data => resolve({
                ok: 1, data
            }), reject);
        });
    },
    findPage() {
        let {
            data,
            collection
        } = this.params;
        let getDataCtrl = 'find';
        let getTotalCtrl = 'countDocuments';
        let param = {
            sort: {createTime: 1},
            projection: {password: 0, _id: 0}
        };
        let {page, rows, pageSize, exact} = data;
        let getDataPas = {collection, ctrl: getDataCtrl, data, param};
        let getTotalPas = {collection, ctrl: getTotalCtrl, data};
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
                if (data.hasOwnProperty(key) && typeof data[key] === 'string' && key !== "id") {
                    data[key] = {$regex: data[key]};
                }
            }
        }
        let getData = db.connect(getDataPas);
        let getTotal = db.connect(getTotalPas);
        return new Promise((resolve, reject) => {
            Promise.all([getData, getTotal]).then((data) => {
                resolve({
                    data: {
                        page: page,
                        pageSize: pageSize,
                        total: data[1],
                        maxPage: Math.ceil(data[1] / pageSize),
                        rows: data[0]
                    },
                    ok: 1
                });
            }, reject);
        });
    },
    add() {
        let {
            data,
            collection
        } = this.params;
        let ctrl = 'insertMany';
        if (!Array.isArray(data)) data = [data];
        data.forEach((item) => {
            item.id = item._id = db.ObjectID().toString();
            item.createTime = +new Date();
        });
        let params = {collection, ctrl, data};
        return new Promise((resolve, reject) => {
            db.connect(params).then((data) => resolve(
                Object.assign({data: data.ops}, data.result)
            ), reject);
        })
    },
    updateOne() {
        let {
            data,
            collection
        } = this.params;
        let param;
        let params;
        let ctrl = 'updateOne';
        return new Promise((resolve, reject) => {
            if (data.id) {
                param = {$set: data};
                data = {id: data.id};
                params = {collection, ctrl, data, param};
                db.connect(params).then(resolve, reject);
            } else {
                reject('id is not defined');
            }
        });

    },
    updateMany() {
        let {
            data,
            collection
        } = this.params;
        let param;
        let params;
        let ctrl = 'updateMany';
        return new Promise((resolve, reject) => {
            if (_util.isObject(data.filter) && _util.isObject(data.update)) {
                param = {$set: data.update};
                data = data.filter;
                params = {collection, ctrl, data, param};
                db.connect(params).then(resolve, reject);
            } else {
                reject('filter or update attribute is not object');
            }
        });

    },
    remove() {
        let {
            data,
            collection
        } = this.params;
        let ctrl = 'deleteMany';
        let params = {collection, ctrl, data};
        return new Promise((resolve, reject) => {
            if (Object.keys(data).length) {
                for (let key in data) {
                    if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
                        data[key] = {$in: data[key]}
                    }
                }
                db.connect(params).then(resolve, reject);
            } else {
                reject('parameter is null');
            }
        });
    },
    upload(req) {
        let uploadDir = 'public/upload';
        let options = {
            uploadDir,
            // encoding: 'utf-8',
            // maxFields: 1000,
            // autoFiles: true,
            // autoFields: true,
            // maxFilesSize: Infinity,
            // maxFieldsSize: 1024 * 1024 * 2
        };
        let form = new multiparty.Form(options);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        return new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                let fileList = [];
                if (err) return reject(err);
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
                                fs.unlink(item.path, (err) => console.log('delete file error:', err));
                            }
                        })
                    }
                }
                if (fileList.length) {
                    if (Object.keys(fields).length) {
                        fields.files = fileList;
                        this.params.data = fields;
                    } else {
                        this.params.data = fileList;
                    }
                    this.add().then((data) => {
                        resolve(Object.assign({fileTotal: fileList.length}, data));
                    }, reject);
                } else {
                    reject('Upload file is empty');
                }
            });
        });
    },
    removeFile() {
        return new Promise((resolve, reject) => {
            if (this.params.data.id) {
                this.find().then((data) => {
                    data.forEach((item) => {
                        if (item.files && item.files.length) {
                            item.files.forEach((item) => {
                                fs.unlink(item.path, (err) => console.log('delete file error:', err));
                            })
                        } else {
                            fs.unlink(item.path, (err) => console.log('delete file error:', err));
                        }
                    });
                    remove().then(resolve, reject);
                }, reject);
            } else {
                reject('id is not defined');
            }
        });
    }
};

router.all('/*', (req, res, next) => {
    let data = req._data;
    let path = req.params['0'].split('/');
    let type = path.pop();
    let collection = path.shift();
    let params = {data, path, collection};
    if (collection && reduce.hasOwnProperty(type)) {
        reduce.params = params;
        reduce[type](req).then(data => res.send(data), err => res.status(400).send(err));
    } else {
        next();
    }
});


function rejected(res, err) {
    res.status(400).send(err);
}

module.exports = router;