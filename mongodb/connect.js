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
const green = chalk.bold.green;
const red = chalk.bold.red;
const log = console.log;

function connect(params) {
    const {collection, ctrl, ops} = params;
    log(green('\nparams:\n'), JSON.stringify(ops), "\n");
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.dbUrl, config.dbOptions).then((client) => {
            const db = client.db(config.dbName);
            const col = db.collection(collection);
            let result = col[ctrl](...ops);
            if (ctrl === "find" || ctrl === "aggregate") result = result.toArray();
            result.then((data) => {
                resolve(data);
                client.close();
            }, (err) => {
                reject(err.toString());
                client.close();
                log(red('mongodb collection ctrl error:\n'), err, "\n");
            });
        }, (err) => {
            reject(err.toString());
            log(red('mongodb client connection error:\n'), err, "\n");
        }).catch((err) => {
            reject(err.toString());
            log(red('mongodb client error:\n'), err, "\n");
        });
    });
}

module.exports = {
    connect,
    ObjectID
};