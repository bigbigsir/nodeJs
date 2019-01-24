/**
 * Created by: MoJie
 * Date: 2019/1/15
 */
'use strict';
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
const config = require('../config');
const chalk = require('chalk');
const yellow = chalk.bold.yellow;
const green = chalk.bold.green;

function connect(params) {
    console.log(green('\nparams:\n'), params, "\n");
    const {collection, ctrl, data, param, options} = params;
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.dbUrl, config.dbOptions).then((client) => {
            const db = client.db(config.dbName);
            const col = db.collection(collection);
            let result = col[ctrl](data, param, options);
            if (ctrl === "find") result = result.toArray();
            result.then((data) => {
                resolve(data);
                client.close();
                // console.log(green('result data:\n'), data, "\n");
            }, (err) => {
                reject(err.toString());
                client.close();
                console.log(yellow('mongodb collection ctrl error:\n'), err, "\n");
            });
        }, (err) => {
            reject(err.toString());
            console.log(yellow('mongodb client connection error:\n'), err, "\n");
        }).catch((err) => {
            reject(err.toString());
            console.log(yellow('mongodb client error:\n'), err, "\n");
        });
    });
}

// connect({
//     collection: 'user',
//     ctrl: 'insert',
//     data: {},
//     param: {
//         limit:5,
//         skip:10,
//         sort: {createTime: 1},
//         projection: {pwd: 0}
//     }
// });

module.exports = {
    connect,
    ObjectID
};