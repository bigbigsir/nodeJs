/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict';

require('colors');
const Fs = require('fs');
const Express = require('express');
const Multiparty = require('multiparty');
const DB = require('../mongodb/connect');
const _util = require('../common/util');
const languages = require('../language');
const Router = Express();

let language;

const reduce = {
  // 新增单个或多个数据到集合中
  add() {
    let params;
    let ctrl = 'insertMany';
    let {data, collection} = this.params;
    let isArray = Array.isArray(data);
    let docs = isArray ? data : [data];
    docs.forEach((item) => {
      item.id = item._id = DB.ObjectID().toString();
      item.createTime = +new Date();
    });
    params = {collection, ctrl, ops: [docs]};
    return new Promise((resolve, reject) => {
      DB.connect(params).then((data) => {
        data = Object.assign({data: isArray ? data.ops : data.ops[0]}, data.result);
        resolve(data);
      }, reject);
    })
  },

  // 查询条件匹配的树形数据，如果没有指定条件就查询parentId为null的树形数据
  tree() {
    let ctrl = 'find';
    let {data, collection} = this.params;
    let options = {
      sort: {sort: 1},
      projection: {_id: 0, password: 0}
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
      let getRoot = DB.connect(getRootPas);
      let getChild = DB.connect(getChildPas);
      Promise.all([getRoot, getChild]).then((data) => {
        data[0].forEach((root) => {
          appendToRoot(root, data[1]);
        });
        resolve({ok: 1, data: data[0]});

        function appendToRoot(root, nodes) {
          root.children = [];
          for (let i = nodes.length; i--;) {
            if (nodes[i] && root.id === nodes[i].parentId) {
              root.children.unshift(...nodes.splice(i, 1));
              appendToRoot(root.children[0], nodes);
            }
          }
        }
      }, reject);
    });
  },

  // 查找与指定条件匹配的多条数据，默认为模糊查询（可指定exact为true进行精确查找）
  // 如果某个查询条件为数组，数组中的某一项值匹配，就会返回该数据；
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
      DB.connect(params).then((data) => resolve({
        ok: 1, data
      }), reject);
    });
  },

  // 查找与指定条件匹配的第一条数据（单条查询）
  findOne() {
    let ctrl = 'findOne';
    let {data: query, collection} = this.params;
    let options = {
      sort: {createTime: 1},
      projection: {_id: 0, password: 0}
    };
    let params = {collection, ctrl, ops: [query, options]};
    return new Promise((resolve, reject) => {
      DB.connect(params).then((data) => resolve({
        ok: 1, data
      }), reject);
    });
  },

  // 分页查询，默认为模糊查询（可指定exact为true进行精确查找）
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
      let getData = DB.connect(getDataPas);
      let getTotal = DB.connect(getTotalPas);
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

  // 修改id匹配的单条数据；
  updateOne(update, isInteriorCall) {
    let params;
    let ctrl = 'updateOne';
    let {data, collection} = this.params;
    let filter = {id: data.id};
    update = isInteriorCall ? update : {$set: data};
    params = {collection, ctrl, ops: [filter, update]};
    return new Promise((resolve, reject) => {
      if (data.id) {
        DB.connect(params).then(resolve, reject);
      } else {
        reject('id arguments cannot be null');
      }
    });
  },

  // 修改update属性匹配的多条数据
  updateMany() {
    let params;
    let ctrl = 'updateMany';
    let {data, collection} = this.params;
    let filter = data.filter;
    let update = data.update;
    delete update.id;
    delete update._id;
    return new Promise((resolve, reject) => {
      if (_util.isObject(filter) && _util.isObject(filter)) {
        update = {$set: update};
        params = {collection, ctrl, ops: [filter, update]};
        DB.connect(params).then(resolve, reject);
      } else {
        reject('filter or update attribute is not object');
      }
    });
  },

  // 删除与指定条件匹配的多条数据，禁止了无参数删除，否则会删除整个collection
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
      if (Object.keys(filter).length) {
        DB.connect(params).then(({result}) => {
          resolve(result)
        }, reject);
      } else {
        reject('arguments cannot be null');
      }
    });
  },

  // 上传文件，如果附带其他参数，文件数据会在files属性中，否则返回上传文件信息数组
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
    let form = new Multiparty.Form(options);
    if (!Fs.existsSync(uploadDir)) {
      Fs.mkdirSync(uploadDir);
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
                Fs.unlink(item.path, (err) => {
                  err && console.log('delete file error:\n'.red.bold, err, '\n')
                });
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

  // 查找id匹配的文件数据
  // 使用文件路径删除文件，并删除该条数据
  removeFile() {
    return new Promise((resolve, reject) => {
      if (this.params.data.id) {
        this.find().then(({data}) => {
          let fileTotal = 0;
          data.forEach((item) => {
            if (item.files && item.files.length) {
              item.files.forEach((item) => {
                fileTotal++;
                Fs.unlink(item.path, (err) => {
                  err && console.log('delete file error:\n'.red.bold, err, '\n')
                });
              })
            } else {
              fileTotal++;
              Fs.unlink(item.path, (err) => {
                err && console.log('delete file error:\n'.red.bold, err, '\n')
              })
            }
          });
          this.remove().then(data => {
            data.fileTotal = fileTotal;
            resolve(data);
          }, reject);
        }, reject);
      } else {
        reject('id arguments cannot be null');
      }
    });
  },

  // 查找匹配的数据，使用localField字段中的值在被关联集合中匹配foreignField的值
  joinQuery() {
    let ctrl = 'aggregate';
    let {data, path, collection} = this.params;
    let formCol = path[0];
    let localField = `${collection}_${formCol}`;
    let pipeline = [
      {
        $match: data,
      }, {
        $lookup: {
          from: formCol,          // 关联集合
          localField: localField, // 关联字段（用该字段中的值去匹配被关联字段的值）
          foreignField: 'id',     // 被关联的字段
          as: localField          // 查找的结果，返回字段
        },
      },
    ];
    let params = {collection, ctrl, ops: [pipeline]};
    return new Promise((resolve, reject) => {
      if (formCol) {
        DB.connect(params).then((data) => {
          resolve({
            ok: 1,
            data: data[0] && data[0][localField]
          });
        }, reject);
      } else {
        reject('collection to join cannot be null');
      }
    });
  },

  // 查找id匹配的数据，将joinIds数组中的id，保存到collection_formCol字段中；
  // collection指当前要操作的集合名字，formCol指被关联的集合名字
  createJoin() {
    let {data, path, collection} = this.params;
    let formCol = path[0];
    let localField = `${collection}_${formCol}`;
    let update = {
      $addToSet: {
        [localField]: {$each: data.joinIds}
      }
    };
    if (formCol) {
      return this.updateOne(update, true);
    } else {
      return Promise.reject('collection to join cannot be null');
    }
  },

  // 查找id匹配的数据，将collection_formCol字段中与joinIds数组中id匹配的值删除；
  // collection指当前要操作的集合名字，formCol指被关联的集合名字
  removeJoin() {
    let {data, path, collection} = this.params;
    let formCol = path[0];
    let localField = `${collection}_${formCol}`;
    let update = {
      $pullAll: {
        [localField]: data.joinIds
      }
    };
    if (formCol) {
      return this.updateOne(update, true);
    } else {
      return Promise.reject('collection to join cannot be null');
    }
  }
};

Router.all('/*', (req, res, next) => {
  let data = req._data;
  let path = req.params['0'].split('/');
  let type = path.pop();
  let collection = path.shift();
  let params = {data, path, collection};
  language = languages[req._language] ? languages[req._language] : languages['zh-CN'];
  if (collection && reduce.hasOwnProperty(type)) {
    reduce.params = params;
    reduce[type](req).then(
      data => res.send(data),
      err => {
        res.send({
          ok: 0,
          msg: language['errorMsg'],
          reason: err.toString()
        });
        console.log('router error:\n'.red.bold, err, "\n");
      }
    ).catch(err => {
      console.log('router error:\n'.red.bold, err, "\n");
    });
  } else {
    next();
  }
});

module.exports = Router;
