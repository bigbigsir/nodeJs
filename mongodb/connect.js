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

function connect(options) {
    console.log(green('\noptions:\n'), options, "\n");
    const {collection, ctrl, data, param} = options;
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.dbUrl, config.dbOptions)
            .then((client) => {
                let result;
                const db = client.db(config.dbName);
                const col = db.collection(collection);
                if (ctrl === "find") result = col[ctrl](data, param).toArray();
                else result = col[ctrl](data, param);
                result.then((data) => {
                    resolve(data);
                    client.close();
                    // console.log(green('result data:\n'), data, "\n");
                }, (err) => {
                    reject(err);
                    client.close();
                    console.log(yellow('collection ctrl error:\n'), err, "\n");
                });
            }, (err) => {
                reject(err);
                console.log(yellow('MongoClient connect error:\n'), err, "\n");
            })
            .catch((err) => {
                reject(err);
                console.log(yellow('MongoClient error:\n'), err, "\n");
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