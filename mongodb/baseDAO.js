'use strict';
/**
 * Created by: MoJie
 * Date: 2018/6/1
 * Time: 11:16
 * 逻辑处理层
 * 依据不同的请求执行不同的数据库操作请求，处理逻辑，并格式化参数，向数据处理层发起请求，等待响应。
 * 格式化web请求参数、collection表名、对应的数据库操作键，操作键所需的参数。
 */

const db = require('./dataBase');

/**
 * 数据库操作方法分发
 * ops     {Object}     请求路径、方法、参数、回调组装对象
 * operate {String}     操作类型
 * cb      {Function}   回调函数
 */

function reduce(ops) {
    let {operate, cb} = ops;
    switch (operate) {
        case 'login':
            login(ops);
            break;
        case 'find':
            find(ops);
            break;
        case 'add':
            insert(ops);
            break;
        case 'update':
            update(ops);
            break;
        case 'remove':
            remove(ops);
            break;
        case 'tree':
            graphLookup(ops);
            break;
        case 'join':
            join(ops);
            break;
        case 'joinFind':
            joinFind(ops);
            break;
        case 'removeJoin':
            removeJoin(ops);
            break;
        case 'removeFile':
            removeFile(ops);
            break;
        default:
            cb(db.error('请求方法错误:' + operate));
    }
}

/**
 * ==================================================================
 * Ps：变量、参数说明
 * @param     {Object} ops 请求路径、参数、回调、操作类型组装成的参数对象
 * paths      {Array}      请求路径
 * collection {String}     数据库集合名称
 * operate    {String}     请求方法类型
 * param      {Object}     请求传递过来的参数
 * cb         {Function}   回调函数
 * ==================================================================
 */

// 登录方法
function login(ops) {
    let {paths, param, cb} = ops;
    let collection = paths[0];
    if (param.acc && param.pwd) {
        param = {$or: [{code: param.acc}, {phone: param.acc}, {email: param.acc}]};
        let options = {
            collection,
            params: [param],
            ctrl: 'find',
            func: cb
        };
        db.collection(options);
    } else {
        cb({
            success: false,
            message: "请输入账号或密码"
        })
    }
}

// 查找方法
function find(ops) {
    let {paths, param, cb} = ops;
    let collection = paths[0];
    param._ ? delete param._ : null;//去除ajax的get请求自带_属性
    let {
        page,
        rows,
        pageSize,
        findType
    } = param;
    delete param.page;
    delete param.rows;
    delete param.pageSize;
    delete param.findType;
    for (let key in param) {
        if (findType !== 'exact' && key !== '_id') {
            param[key] = {$regex: param[key]};
        }
    }
    let options = {
        collection,
        ctrl: 'find',
        func: cb
    };
    if (!page && !pageSize) {
        options.params = [param, {sort: {createTime: 1}, projection: {pwd: 0}}];
        db.collection(options);
    }
    else {
        options.ctrl = 'findPage';
        page = parseInt(page);
        pageSize = parseInt(pageSize) || parseInt(rows);
        page = isNaN(page) ? 1 : (page > 0 ? page : 1);
        pageSize = isNaN(pageSize) ? 5 : (pageSize > 0 ? pageSize : 5);
        options.params = {
            page,
            pageSize,
            param: [param, {
                sort: {createTime: 1},
                projection: {pwd: 0}
            }]
        };
        db.collection(options);
    }
}

// 新增方法
function insert(ops) {
    let {paths, param, cb} = ops;
    let collection = paths[0];
    if (Object.prototype.toString.call(param) === '[object Array]') {
        if (!param.length) return cb({success: false, message: '新增参数为空'});
        for (let i = param.length; i--;) {
            param[i]._id = db.ObjectID().toString();
            param[i].createTime = +new Date();
        }
    }
    else {
        param.createTime = +new Date();
        param._id = db.ObjectID().toString();
    }
    db.collection({
        collection,
        ctrl: 'insert',
        params: [param],
        func: cb
    });
}

// 更新方法
function update(ops, joinData) {
    let {paths, param, cb} = ops;
    let collection = paths[0];
    if (!param._id) return cb({success: false, message: '更新数据（_id）参数为空'});
    let _id = param._id;
    delete param._id;
    let params = [{_id: _id}, {$set: param}];
    if (joinData) { // 添加、删除关联数据
        params.pop();
        params.push(joinData);
    }
    else {
        let reg = new RegExp(collection + '_');
        for (let key in param) {
            reg.test(key) ? delete param[key] : null;
        }
        param.updateTime = +new Date();
    }
    db.collection({
        params,
        collection,
        ctrl: 'update',
        func: cb
    });
}

// 删除方法
function remove(ops) {
    let {paths, param, cb} = ops;
    let collection = paths[0];
    if (param._id) {
        param._id = typeof param._id === 'string' ?
            param._id.split(',') :
            param._id;
        param._id = {$in: param._id};
    }
    db.collection({
        collection,
        ctrl: 'deleteMany',
        params: [param],
        func: cb
    });
}

// 关联数据方法
function join(ops) {
    let {key, val} = formatJoinParam(ops);
    if (key && val) {
        update(ops, {$addToSet: {[key]: {$each: val}}});
    }
}

// 删除关联数据方法
function removeJoin(ops) {
    let {key, val} = formatJoinParam(ops);
    if (key && val) {
        update(ops, {$pullAll: {[key]: val}});
    }
}

// 关联查询方法
function joinFind(ops) {
    let {paths, param, cb} = ops;
    let collection = paths[0];
    let joinCol = paths[1];
    let localField = collection + '_' + joinCol;
    let pipeline = [
        {
            $match: param,
        }, {
            $project: {[localField]: 1, _id: 0},
        }, {
            $lookup: {
                from: joinCol, // 右集合
                localField: localField, // 左集合 join字段
                foreignField: '_id', // 右集合 join字段
                as: localField // 新生成字段（类型array）
            },
        },
    ];
    db.collection({
        collection,
        ctrl: 'lookup',
        params: pipeline,
        func(data) {
            data.content[localField] ?
                data.content = data.content[localField] : null;
            cb(data);
        }
    });
}

// 关联数据格式化并返回
function formatJoinParam(ops) {
    let {paths, param, cb} = ops;
    let key = paths[0] + '_' + paths[1];
    let val = param['joinId'];
    if (!val) return cb({success: false, message: '关联操作（joinId）参数为空'});
    typeof val === 'string' ? val = val.split(',') : null;
    delete ops.param['joinId'];
    return {key, val};
}

// 删除文件
function removeFile(ops) {
    let {param, cb} = ops;
    if (param._id) {
        let promises = [], promiseItem, cloneOps;
        // 删除某条数据下面的files数组里面的文件数据，需要循环去单个删除
        // 暂未找出一次性删除files数组里面的多个文件数据
        param.path.forEach(function (item) {
            cloneOps = JSON.parse(JSON.stringify(ops));
            promiseItem = new Promise(function (resolve, reject) {
                cloneOps.cb = function (data) {
                    data.success ? resolve(data.content) : reject(data.message);
                };
                update(cloneOps, {$pull: {files: {path: item}}});
            });
            promises.push(promiseItem);
        });
        Promise.all(promises).then(
            function fulfilled(vals) {
                let count = vals.reduce(function (total, currentValue) {
                    return total + currentValue;
                }, 0);
                cb(db.success(count));
            },
            function rejected(err) {
                cb(db.error(err));
            },
        )
    } else {
        param.path = {$in: param.path};
        remove(ops);
    }
}

// 递归查询
function graphLookup(ops) {
    let {paths, param, cb} = ops;
    let collection = paths[0];
    // let pipeline = [
    //     {
    //         $match: {...param, _parentId: null}
    //     },
    //     {
    //         $graphLookup: {
    //             from: collection,
    //             startWith: "$_id",
    //             connectFromField: "_id",
    //             connectToField: "_parentId",
    //             as: "children",
    //         }
    //     }, {
    //         $sort: {sort: 1}
    //     }
    // ];
    db.collection({
        collection,
        ctrl: 'recursion',
        params: [{...param, _parentId: null}, {sort: {sort: 1}}],
        func: cb
    });
}

module.exports = {reduce};