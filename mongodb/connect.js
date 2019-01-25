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
    log(green('\nparams:\n'), params, "\n");
    const {collection, ctrl, data, param, options} = params;
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.dbUrl, config.dbOptions).then((client) => {
            const db = client.db(config.dbName);
            const col = db.collection(collection);
            let result = col[ctrl](data, param, options);
            if (ctrl === "find") result = result.toArray();
            if (ctrl === "aggregate") result = col[ctrl]([data, param]).toArray();
            result.then((data) => {
                resolve(data);
                client.close();
                // log(green('result data:\n'), data, "\n");
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