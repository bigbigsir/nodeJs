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
const chalk = require('chalk');
const red = chalk.bold.red;
const router = express();

const log = console.log;
const reduce = {
    add() {
        let params;
        let ctrl = 'insertMany';
        let {data, collection} = this.params;
        let isArray = Array.isArray(data);
        let docs = isArray ? data : [data];
        docs.forEach((item) => {
            item.id = item._id = db.ObjectID().toString();
            item.createTime = +new Date();
        });
        params = {collection, ctrl, ops: [docs]};
        return new Promise((resolve, reject) => {
            db.connect(params).then((data) => {
                data = Object.assign({data: isArray ? data.ops : data.ops[0]}, data.result);
                resolve(data);
            }, reject);
        })
    },
    tree() {
        let ctrl = 'find';
        let {data, collection} = this.params;
        let options = {
            sort: {sort: 1},
            projection: {_id: 0}
        };
        let query = Object.keys(data).length ? data : {parentId: null};
        let neQuery = Object.assign({}, query);
        for (let key in neQuery) {
            if (neQuery.hasOwnProperty(key)) {
                neQuery[key] = {$ne: neQuery[key]};
            }
        }
        return new Promise((resolve, reject) => {
            let getRootPas = {collection, ctrl, ops: [query, options]};
            let getChildPas = {collection, ctrl, ops: [neQuery, options]};
            let getRoot = db.connect(getRootPas);
            let getChild = db.connect(getChildPas);
            Promise.all([getRoot, getChild]).then((data) => {
                data[0].forEach((root) => {
                    appendToRoot(root, data[1]);
                });
                resolve(data[0]);

                function appendToRoot(root, nodes) {
                    root.children = [];
                    for (let i = nodes.length; i--;) {
                        if (nodes[i] && root.id === nodes[i].parentId) {
                            root.children.push(...nodes.splice(i, 1));
                            appendToRoot(root.children[root.children.length - 1], nodes);
                        }
                    }
                }
            }, reject);
        });
    },
    find() {
        let params;
        let ctrl = 'find';
        let {data: query, collection} = this.params;
        let options = {
            sort: {createTime: 1},
            projection: {_id: 0, password: 0}
        };
        if (query.exact) {
            delete query.exact;
        } else {
            for (let key in query) {
                if (query.hasOwnProperty(key)) {
                    if (typeof query[key] === 'string' && key !== 'id') {
                        query[key] = {$regex: query[key]};
                    } else if (Array.isArray(query[key])) {
                        query[key] = {$in: query[key]}
                    }
                }
            }
        }
        params = {collection, ctrl, ops: [query, options]};
        return new Promise((resolve, reject) => {
            db.connect(params).then((data) => resolve({
                ok: 1, data
            }), reject);
        });
    },
    findOne() {
        let ctrl = 'findOne';
        let {data: query, collection} = this.params;
        let options = {
            sort: {createTime: 1},
            projection: {_id: 0, password: 0}
        };
        let params = {collection, ctrl, ops: [query, options]};
        return new Promise((resolve, reject) => {
            db.connect(params).then((data) => resolve({
                ok: 1, data
            }), reject);
        });
    },
    findPage() {
        let getDataCtrl = 'find';
        let getTotalCtrl = 'countDocuments';
        let {data: query, collection} = this.params;
        let {page, rows, pageSize, exact} = query;
        let options = {
            sort: {createTime: 1},
            projection: {_id: 0, password: 0}
        };
        delete query.exact;
        delete query.page;
        delete query.rows;
        delete query.pageSize;
        page = parseInt(page);
        pageSize = parseInt((pageSize || rows));
        page = (page && page > 0) ? page : 1;
        pageSize = (pageSize && pageSize > 0) ? pageSize : 10;
        options.limit = pageSize;
        options.skip = (page - 1) * pageSize;
        if (!exact) {
            for (let key in query) {
                if (query.hasOwnProperty(key) && typeof query[key] === 'string' && key !== "id") {
                    query[key] = {$regex: query[key]};
                }
            }
        }
        return new Promise((resolve, reject) => {
            let getDataPas = {collection, ctrl: getDataCtrl, ops: [query, options]};
            let getTotalPas = {collection, ctrl: getTotalCtrl, ops: [query]};
            let getData = db.connect(getDataPas);
            let getTotal = db.connect(getTotalPas);
            Promise.all([getData, getTotal]).then((data) => {
                resolve({
                    ok: 1,
                    data: {
                        page: page,
                        pageSize: pageSize,
                        total: data[1],
                        maxPage: Math.ceil(data[1] / pageSize),
                        rows: data[0]
                    }
                });
            }, reject);
        });
    },
    updateOne() {
        let params;
        let ctrl = 'updateOne';
        let {data, collection} = this.params;
        let filter = {id: data.id};
        let update = {$set: data};
        params = {collection, ctrl, ops: [filter, update]};
        return new Promise((resolve, reject) => {
            if (data.id) {
                db.connect(params).then(resolve, reject);
            } else {
                reject('id is not defined');
            }
        });
    },
    updateMany() {
        let params;
        let ctrl = 'updateMany';
        let {data, collection} = this.params;
        let filter = data.filter;
        let update = data.update;
        return new Promise((resolve, reject) => {
            if (_util.isObject(filter) && _util.isObject(filter)) {
                update = {$set: update};
                params = {collection, ctrl, ops: [filter, update]};
                db.connect(params).then(resolve, reject);
            } else {
                reject('filter or update attribute is not object');
            }
        });
    },
    remove() {
        let params;
        let ctrl = 'deleteMany';
        let {data: filter, collection} = this.params;
        for (let key in filter) {
            if (filter.hasOwnProperty(key) && Array.isArray(filter[key])) {
                filter[key] = {$in: filter[key]}
            }
        }
        params = {collection, ctrl, ops: [filter]};
        return new Promise((resolve, reject) => {
            if (Object.keys(data).length) {
                db.connect(params).then(({result}) => resolve(result), reject);
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
                                fs.unlink(item.path, (err) => err && log(red('delete file error:\n'), err, '\n'));
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
                    this.add().then(data => {
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
                this.find().then(({data}) => {
                    let fileTotal = 0;
                    data.forEach((item) => {
                        if (item.files && item.files.length) {
                            item.files.forEach((item) => {
                                fileTotal++;
                                fs.unlink(item.path, (err) => err && log(red('delete file error:\n'), err, '\n'));
                            })
                        } else {
                            fileTotal++;
                            fs.unlink(item.path, (err) => err && log(red('delete file error:\n'), err, '\n'));
                        }
                    });
                    this.remove().then(data => {
                        data.fileTotal = fileTotal;
                        resolve(data);
                    }, reject);
                }, reject);
            } else {
                reject('id is not defined');
            }
        });
    }
};

router.all('/*', (req, res, next) => {
    console.log(req.baseUrl);
    let data = req._data;
    let path = req.params['0'].split('/');
    let type = path.pop();
    let collection = path.shift();
    let params = {data, path, collection};
    if (collection && reduce.hasOwnProperty(type)) {
        reduce.params = params;
        reduce[type](req).then(
            data => res.send(data),
            err => res.status(400).send(err)
        );
    } else {
        next();
    }
});

module.exports = router;
