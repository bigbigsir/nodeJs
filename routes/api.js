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
    let ctrl = 'insertMany';
    let {reqData, collection} = this.params;
    let isArray = Array.isArray(reqData);
    let docs = isArray ? reqData : [reqData];
    docs.forEach((item) => {
      item.id = item._id = DB.ObjectID().toString();
      item.createTime = +new Date();
    });
    let params = {collection, ctrl, ops: [docs]};
    return DB.connect(params).then(data => {
      return {
        ...data.result,
        data: isArray ? data.ops : data.ops[0]
      }
    });
  },

  // 查询条件匹配的树形数据，如果没有指定条件就查询parentId为null的树形数据
  tree() {
    let ctrl = 'find';
    let {reqData, collection} = this.params;
    let options = {
      sort: {sort: 1},
      projection: {_id: 0, password: 0}
    };
    let query = Object.keys(reqData).length ? reqData : {parentId: null};
    let neQuery = Object.assign({}, query);
    for (let key in neQuery) {
      if (neQuery.hasOwnProperty(key)) {
        neQuery[key] = {$ne: neQuery[key]};
      }
    }
    let getRootPas = {collection, ctrl, ops: [query, options]};
    let getChildPas = {collection, ctrl, ops: [neQuery, options]};
    let getRoot = DB.connect(getRootPas);
    let getChild = DB.connect(getChildPas);
    return Promise.all([getRoot, getChild]).then(([roots, nodes]) => {
      roots.forEach((root) => {
        appendToRoot(root, nodes);
      });
      return {ok: 1, data: roots};
    });

    // 将子节点添加到根节点下，组成树形结构
    function appendToRoot(root = {}, nodes = []) {
      root.children = [];
      for (let i = nodes.length; i--;) {
        if (nodes[i] && root.id === nodes[i].parentId) {
          root.children.unshift(...nodes.splice(i, 1));
          appendToRoot(root.children[0], nodes);
        }
      }
    }
  },

  // 查找与指定条件匹配的多条数据，默认为模糊查询（可指定exact为true进行精确查找）
  // 如果某个查询条件为数组，数组中的某一项值匹配，就会返回该数据；
  find() {
    let ctrl = 'find';
    let {reqData: query, collection} = this.params;
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
    let params = {collection, ctrl, ops: [query, options]};
    return DB.connect(params).then(data => ({ok: 1, data}));
  },

  // 查找与指定条件匹配的第一条数据（单条查询）
  findOne() {
    let ctrl = 'findOne';
    let {reqData: query, collection} = this.params;
    let options = {
      sort: {createTime: 1},
      projection: {_id: 0, password: 0}
    };
    let params = {collection, ctrl, ops: [query, options]};
    return DB.connect(params).then(data => ({ok: 1, data}));
  },

  // 分页查询，默认为模糊查询（可指定exact为true进行精确查找）
  findPage() {
    let getDataCtrl = 'find';
    let getTotalCtrl = 'countDocuments';
    let {reqData: query, collection} = this.params;
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
    let getDataPas = {collection, ctrl: getDataCtrl, ops: [query, options]};
    let getTotalPas = {collection, ctrl: getTotalCtrl, ops: [query]};
    let getData = DB.connect(getDataPas);
    let getTotal = DB.connect(getTotalPas);
    return Promise.all([getData, getTotal]).then(data => {
      return {
        ok: 1,
        data: {
          page: page,
          pageSize: pageSize,
          total: data[1],
          maxPage: Math.ceil(data[1] / pageSize),
          rows: data[0]
        }
      };
    });
  },

  // 修改id匹配的单条数据；
  updateOne(isInteriorCall, update) {
    let ctrl = 'updateOne';
    let {reqData, collection} = this.params;
    let filter = {id: reqData.id};
    update = isInteriorCall ? update : {$set: data};
    let params = {collection, ctrl, ops: [filter, update]};
    if (filter.id) {
      return DB.connect(params)
    } else {
      return Promise.reject('id arguments cannot be null');
    }
  },

  // 修改update属性匹配的多条数据
  updateMany() {
    let ctrl = 'updateMany';
    let {reqData, collection} = this.params;
    let filter = reqData.filter;
    let update = reqData.update;
    delete update.id;
    delete update._id;
    if (_util.isObject(filter) && _util.isObject(update)) {
      update = {$set: update};
      let params = {collection, ctrl, ops: [filter, update]};
      return DB.connect(params);
    } else {
      return Promise.reject('filter or update attribute is not object');
    }
  },

  // 删除与指定条件匹配的多条数据，禁止了无参数删除，否则会删除整个collection
  remove() {
    let ctrl = 'deleteMany';
    let {reqData: filter, collection} = this.params;
    for (let key in filter) {
      if (filter.hasOwnProperty(key) && Array.isArray(filter[key])) {
        filter[key] = {$in: filter[key]}
      }
    }
    let params = {collection, ctrl, ops: [filter]};
    if (Object.keys(filter).length) {
      return DB.connect(params).then(data => data.result);
    } else {
      return Promise.reject('arguments cannot be null');
    }
  },

  // 上传文件，如果附带其他参数，文件数据会在files属性中，否则返回上传文件信息数组
  upload(req) {
    let uploadDir = 'public/upload';
    let options = {
      uploadDir
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
        // fields 其他参数，字段对应的值为数组
        for (let key in fields) {
          if (fields.hasOwnProperty(key)) fields[key] = fields[key].join();
        }
        // files 上传的文件字段：file1、file2
        for (let key in files) {
          if (files.hasOwnProperty(key)) {
            // 每个字段下的文件数组
            files[key].forEach((item) => {
              // 判断上传的文件是否为空，如是则删除，系统生成的空文件
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
                  err && console.log('Delete File Error:\n'.red.bold, err, '\n')
                });
              }
            })
          }
        }
        if (fileList.length) {
          // 是否有其他参数,有就把文件数组作为一个字段保存，否则就作为文件主体保存
          if (Object.keys(fields).length) {
            fields.files = fileList;
            this.params.reqData = fields;
          } else {
            this.params.reqData = fileList;
          }
          this.add().then(data => {
            resolve({
              ...data,
              fileTotal: fileList.length
            })
          }, reject);
        } else {
          reject('Upload file is empty');
        }
      });
    });
  },

  // 查找id匹配的数据
  // 使用文件路径删除文件，并删除该条数据
  removeFile() {
    if (this.params.reqData.id) {
      let removeTotal = 0;
      return this.find().then(({data}) => {
        // 如果数据是文件数据，就依据path字段删除，如不是则依据files字段中的path删除
        data.forEach((item) => {
          if (item.files && item.files.length) {
            item.files.forEach((item) => {
              removeTotal++;
              Fs.unlink(item.path, (err) => {
                err && console.log('Delete File Error:\n'.red.bold, err, '\n')
              });
            })
          } else {
            removeTotal++;
            Fs.unlink(item.path, (err) => {
              err && console.log('Delete File Error:\n'.red.bold, err, '\n')
            })
          }
        });
        return this.remove();
      }).then(data => {
        data.removeTotal = removeTotal;
        return data
      });
    } else {
      return Promise.reject('id cannot be null');
    }
  },

  // 查找匹配的数据，使用localField字段中的值在被关联集合中匹配foreignField的值
  joinQuery() {
    let ctrl = 'aggregate';
    let {reqData, collection, fromCollection} = this.params;
    let localField = `${collection}_${fromCollection}`;
    let pipeline = [
      {
        $match: reqData,
      }, {
        $sort: {createTime: 1}
      }, {
        $project: {_id: 0, password: 0}
      }, {
        $lookup: {
          from: fromCollection,   // 关联集合
          localField: localField, // 关联字段（用该字段中的值去匹配被关联字段的值）
          foreignField: 'id',     // 被关联的字段（关联字段已写为id字段，如需其他关联字段需另行修改）
          as: localField          // 查找的结果，返回字段
        },
      },
    ];
    let params = {collection, ctrl, ops: [pipeline]};

    if (fromCollection && reqData.id) {
      return DB.connect(params).then(data => {
        return {
          ok: 1,
          data: data[0]
        }
      });
    } else {
      return Promise.reject('fromCollection or id cannot be null');
    }
  },

  // 查找id匹配的数据，将joinId参数中的id，保存到该数据${collection}_${fromCollection}字段中，达到关联的效果
  // collection指当前要操作的集合名字，fromCollection指被关联的集合名字
  createJoin() {
    let {reqData, collection, fromCollection} = this.params;
    let localField = `${collection}_${fromCollection}`;
    let update = {
      $addToSet: {
        [localField]: {
          $each: Array.isArray(reqData['joinId'])
            ? reqData['joinId']
            : [reqData['joinId']]
        }
      }
    };
    if (fromCollection && reqData['joinId']) {
      return this.updateOne(true, update);
    } else {
      return Promise.reject('fromCollection or joinId cannot be null');
    }
  },

  // 查找id匹配的数据，该数据中${collection}_${fromCollection}字段中与joinId参数中id匹配的值删除，达到取消关联的效果
  // collection指当前要操作的集合名字，fromCollection指被关联的集合名字
  removeJoin() {
    let {reqData, collection, fromCollection} = this.params;
    let localField = `${collection}_${fromCollection}`;
    let update = {
      $pullAll: {
        [localField]: reqData['joinId']
      }
    };
    if (fromCollection && reqData['joinId']) {
      return this.updateOne(true, update);
    } else {
      return Promise.reject('fromCollection or joinId cannot be null');
    }
  }
};

Router.all('/*', (req, res, next) => {
  let reqData = req._requestParams;
  let path = req.url.replace(/(^\/)|(\?[\s\S]*)/g, '').split('/');
  let handle = path.pop();
  let collection = path.shift();
  let fromCollection = path.shift();
  let params = {reqData, collection, fromCollection};
  language = languages[req._language] ? languages[req._language] : languages['zh-CN'];
  if (collection && reduce.hasOwnProperty(handle)) {
    reduce.params = params;
    reduce[handle](req).then(data => {
      data.msg = 'success';
      res.send(data)
    }).catch(err => {
      if (err.ok !== undefined && err.msg !== undefined) {
        res.send(err);
      } else {
        res.send({ok: 0, msg: language['errorMsg'], error: err.toString()});
        console.log('Api Route Error:\n'.red.bold, err, "\n");
      }
    });
  } else {
    next();
  }
});

module.exports = Router;
