/**
 * Created by: MoJie
 * Date: 2018/12/21
 */
'use strict'

require('colors')
const Fs = require('fs')
const Express = require('express')
const Multiparty = require('multiparty')
const DB = require('../mongodb/connect')
const isPlainObject = require('lodash/isPlainObject')
const languages = require('../language')
const Router = Express()

let language

const reduce = {
  // 新增单个或多个数据到集合中
  add() {
    const ctrl = 'insertMany'
    const { reqParam, collection } = this.params
    const isArray = Array.isArray(reqParam)
    const docs = isArray ? reqParam : [reqParam]
    docs.forEach((item) => {
      item.id = item._id = DB.ObjectID().toString()
      item.createDate = +new Date()
    })
    const params = {
      collection,
      ctrl,
      dbOptions: [docs]
    }
    return DB.connect(params).then(data => {
      return {
        ...data.result,
        data: isArray ? data.ops : data.ops[0]
      }
    })
  },

  // 查询条件匹配的树形数据，如果没有指定条件就查询parentId为null的树形数据
  tree() {
    const ctrl = 'find'
    const { reqParam, collection } = this.params
    const options = {
      sort: { sort: 1 },
      projection: {
        _id: 0,
        password: 0
      }
    }
    const query = Object.keys(reqParam).length ? reqParam : { parentId: null }
    const neQuery = Object.assign({}, query)
    for (const key in neQuery) {
      if (Object.prototype.hasOwnProperty.call(neQuery, key)) {
        neQuery[key] = { $ne: neQuery[key] }
      }
    }
    const getRootPas = {
      collection,
      ctrl,
      dbOptions: [query, options]
    }
    const getChildPas = {
      collection,
      ctrl,
      dbOptions: [neQuery, options]
    }
    const getRoot = DB.connect(getRootPas)
    const getChild = DB.connect(getChildPas)
    return Promise.all([getRoot, getChild]).then(([roots, nodes]) => {
      roots.forEach((root) => {
        appendToRoot(root, nodes)
      })
      return { data: roots }
    })

    // 将子节点添加到根节点下，组成树形结构
    function appendToRoot(root = {}, nodes = []) {
      root.children = []
      for (let i = nodes.length; i--;) {
        if (nodes[i] && root.id === nodes[i].parentId) {
          root.children.unshift(...nodes.splice(i, 1))
          appendToRoot(root.children[0], nodes)
        }
      }
    }
  },

  // 查找与指定条件匹配的多条数据，默认为模糊查询（可指定exact为true进行精确查找）
  // 如果某个查询条件为数组，数组中的某一项值匹配，就会返回该数据；
  find() {
    const ctrl = 'find'
    const { reqParam: query, collection } = this.params
    const options = {
      sort: { createDate: 1 },
      projection: {
        _id: 0,
        password: 0
      }
    }
    if (query.exact) {
      delete query.exact
    } else {
      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          if (typeof query[key] === 'string' && key !== 'id') {
            query[key] = { $regex: query[key] }
          } else if (Array.isArray(query[key])) {
            query[key] = { $in: query[key] }
          }
        }
      }
    }
    const params = {
      collection,
      ctrl,
      dbOptions: [query, options]
    }
    return DB.connect(params).then(data => ({ data }))
  },

  // 查找与指定条件匹配的第一条数据（单条查询）
  findOne(isNeedPassword = false) {
    const ctrl = 'findOne'
    const { reqParam: query, collection } = this.params
    const options = {
      projection: {
        _id: 0,
        password: 0
      }
    }
    if (isNeedPassword) delete options.projection.password
    const params = {
      collection,
      ctrl,
      dbOptions: [query, options]
    }
    return DB.connect(params).then(data => ({ data }))
  },

  // 分页查询，默认为模糊查询（可指定exact为true进行精确查找）
  findPage() {
    const getDataCtrl = 'find'
    const getTotalCtrl = 'countDocuments'
    const { reqParam: query, collection } = this.params
    let { page, rows, pageSize, exact } = query
    const options = {
      sort: { createDate: 1 },
      projection: {
        _id: 0,
        password: 0
      }
    }
    delete query.exact
    delete query.page
    delete query.rows
    delete query.pageSize
    page = parseInt(page)
    pageSize = parseInt((pageSize || rows))
    page = (page && page > 0) ? page : 1
    pageSize = (pageSize && pageSize > 0) ? pageSize : 10
    options.limit = pageSize
    options.skip = (page - 1) * pageSize
    if (!exact) {
      for (const key in query) {
        if (query.hasOwnProperty(key) && typeof query[key] === 'string' && key !== 'id') {
          query[key] = { $regex: query[key] }
        }
      }
    }
    const getDataPas = {
      collection,
      ctrl: getDataCtrl,
      dbOptions: [query, options]
    }
    const getTotalPas = {
      collection,
      ctrl: getTotalCtrl,
      dbOptions: [query]
    }
    const getData = DB.connect(getDataPas)
    const getTotal = DB.connect(getTotalPas)
    return Promise.all([getData, getTotal]).then(data => {
      return {
        data: {
          page: page,
          pageSize: pageSize,
          total: data[1],
          maxPage: Math.ceil(data[1] / pageSize),
          rows: data[0]
        }
      }
    })
  },

  // 修改id匹配的单条数据；
  updateOne(update = null, banUpdateFields = ['password']) {
    const ctrl = 'updateOne'
    const { reqParam, collection } = this.params
    const filter = { id: reqParam.id }
    banUpdateFields.forEach(field => delete reqParam[field])
    update = update || { $set: reqParam }
    const params = {
      collection,
      ctrl,
      dbOptions: [filter, update]
    }
    if (filter.id) {
      return DB.connect(params).then(data => ({ ...data.result }))
    } else {
      return Promise.reject('id arguments cannot be null')
    }
  },

  // 修改update属性匹配的多条数据
  updateMany() {
    const ctrl = 'updateMany'
    const { reqParam, collection } = this.params
    const filter = reqParam.filter
    let update = reqParam.update
    delete update.id
    delete update._id
    delete update.password
    if (isPlainObject(filter) && isPlainObject(update)) {
      update = { $set: update }
      const params = {
        collection,
        ctrl,
        dbOptions: [filter, update]
      }
      return DB.connect(params).then(data => ({ ...data.result }))
    } else {
      return Promise.reject('filter or update attribute is not object')
    }
  },

  // 删除与指定条件匹配的多条数据，禁止了无参数删除，否则会删除整个collection
  remove(allowAll = false) {
    const ctrl = 'deleteMany'
    const { reqParam: filter, collection } = this.params
    for (const key in filter) {
      if (filter.hasOwnProperty(key) && Array.isArray(filter[key])) {
        filter[key] = { $in: filter[key] }
      }
    }
    const params = {
      collection,
      ctrl,
      dbOptions: [filter]
    }
    if (Object.keys(filter).length || allowAll) {
      return DB.connect(params).then(data => ({ ...data.result }))
    } else {
      return Promise.reject('arguments cannot be null')
    }
  },

  // 上传文件，如果附带其他参数，文件数据会在files属性中，否则返回上传文件信息数组
  upload(req) {
    const uploadDir = 'public/upload'
    const options = {
      uploadDir
      // encoding: 'utf-8',
      // maxFields: 1000,
      // autoFiles: true,
      // autoFields: true,
      // maxFilesSize: Infinity,
      // maxFieldsSize: 1024 * 1024 * 2
    }
    if (!Fs.existsSync(uploadDir)) {
      Fs.mkdirSync(uploadDir)
    }
    return new Promise((resolve, reject) => {
      console.log('form.parse')
      const form = new Multiparty.Form(options)
      form.parse(req, (err, fields, files) => {
        const fileList = []
        if (err) return reject(err)
        // fields 其他参数，字段对应的值为数组
        for (const key in fields) {
          if (fields.hasOwnProperty(key)) fields[key] = fields[key].join()
        }
        // files 上传的文件字段：file1、file2
        for (const key in files) {
          if (files.hasOwnProperty(key)) {
            // 每个字段下的文件数组
            files[key].forEach((item) => {
              console.log('item', item)
              // 判断上传的文件是否为空，如是则删除，系统生成的空文件
              if (item.originalFilename) {
                fileList.push({
                  path: item.path,
                  size: item.size,
                  fieldName: item.fieldName,
                  name: item.originalFilename,
                  url: item.path.replace(/\\/g, '/').replace(/^.*public/, '')
                })
              } else {
                Fs.unlink(item.path, (err) => {
                  err && console.log('Delete File Error:\n'.red.bold, err, '\n')
                })
              }
            })
          }
        }
        if (fileList.length) {
          // 是否有其他参数,有就把文件数组作为一个字段保存，否则就作为文件主体保存
          if (Object.keys(fields).length) {
            fields.files = fileList
            this.params.reqParam = fields
          } else {
            this.params.reqParam = fileList
          }
          this.add().then(data => {
            resolve({
              ...data,
              fileTotal: fileList.length
            })
          }, reject)
        } else {
          reject('Upload file is empty')
        }
      })
    })
  },

  // 查找id匹配的数据
  // 使用文件路径删除文件，并删除该条数据
  removeFile() {
    const { reqParam, collection } = this.params
    if (reqParam.id || reqParam.url) {
      let removeTotal = 0
      return this.find().then(({ data }) => {
        // 如果数据是文件数据，就依据path字段删除，如不是则依据files字段中的path删除
        data.forEach((item) => {
          if (item.files && item.files.length) {
            item.files.forEach((item) => {
              removeTotal++
              Fs.unlink(item.path, (err) => {
                err && console.log('Delete File Error:\n'.red.bold, err, '\n')
              })
            })
          } else {
            removeTotal++
            Fs.unlink(item.path, (err) => {
              err && console.log('Delete File Error:\n'.red.bold, err, '\n')
            })
          }
        })
        this.params = {
          reqParam,
          collection
        }
        return this.remove()
      }).then(data => {
        data.removeTotal = removeTotal
        return data
      })
    } else {
      return Promise.reject('id or url cannot be null')
    }
  },

  // 查找id匹配的数据，使用localField字段中的值在被关联集合中匹配foreignField的值
  joinQuery() {
    const ctrl = 'aggregate'
    const { reqParam, collection, fromCollection } = this.params
    const localField = `${collection}_${fromCollection}`
    const pipeline = [
      {
        $match: reqParam
      }, {
        $sort: { createDate: 1 }
      }, {
        $project: {
          _id: 0,
          password: 0
        }
      }, {
        $lookup: {
          from: fromCollection, // 关联集合
          localField: localField, // 关联字段（用该字段中的值去匹配被关联字段的值）
          foreignField: 'id', // 被关联的字段（关联字段已写为id字段，如需其他关联字段需另行修改）
          as: localField // 查找的结果，返回字段
        }
      }
    ]
    const params = {
      collection,
      ctrl,
      dbOptions: [pipeline]
    }

    if (fromCollection && reqParam.id) {
      return DB.connect(params).then(data => {
        return {
          data: data[0] || null
        }
      })
    } else {
      return Promise.reject('fromCollection or id cannot be null')
    }
  },

  // 查找id匹配的数据，将joinId参数中的id，保存到该数据${collection}_${fromCollection}字段中，达到关联的效果
  // collection指当前要操作的集合名字，fromCollection指被关联的集合名字
  createJoin() {
    const { reqParam, collection, fromCollection } = this.params
    const localField = `${collection}_${fromCollection}`
    const update = {
      $addToSet: {
        [localField]: {
          $each: Array.isArray(reqParam.joinId)
            ? reqParam.joinId
            : [reqParam.joinId]
        }
      }
    }
    if (fromCollection && reqParam.joinId) {
      return this.updateOne(update)
    } else {
      return Promise.reject('fromCollection or joinId cannot be null')
    }
  },

  // 查找id匹配的数据，该数据中${collection}_${fromCollection}字段中与joinId参数中id匹配的值删除，达到取消关联的效果
  // collection指当前要操作的集合名字，fromCollection指被关联的集合名字
  removeJoin() {
    const { reqParam, collection, fromCollection } = this.params
    const localField = `${collection}_${fromCollection}`
    const update = {
      $pullAll: {
        [localField]: reqParam.joinId
      }
    }
    if (fromCollection && reqParam.joinId) {
      return this.updateOne(update)
    } else {
      return Promise.reject('fromCollection or joinId cannot be null')
    }
  }
}

Router.all('/*', (req, res, next) => {
  const reqParam = req._requestParam
  const path = req.url.replace(/(^\/)|(\?[\s\S]*)/g, '').split('/')
  const handle = path.pop()
  const collection = path.shift()
  const fromCollection = path.shift()
  const params = {
    reqParam,
    collection,
    fromCollection
  }
  language = languages[req._language] ? languages[req._language] : languages['zh-CN']
  if (collection && reduce.hasOwnProperty(handle)) {
    if (handle !== 'upload') req = undefined
    reduce.params = params
    reduce[handle](req).then(data => {
      data = Object.assign({
        ok: 1,
        msg: 'success'
      }, data)
      res.send(data)
    }).catch(err => {
      if (typeof err.msg === 'string') {
        err = Object.assign({
          ok: 0,
          msg: language.errorMsg
        }, err)
      } else {
        err = {
          ok: 0,
          msg: language.errorMsg,
          error: err.toString()
        }
        console.log('api Route Error:\n'.red.bold, err, '\n')
      }
      res.send(err)
    })
  } else {
    next()
  }
})

module.exports = {
  api: reduce,
  router: Router
}
