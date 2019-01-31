/**
 * Created by: MoJie
 * Date: 2019/1/15
 */
'use strict';

const Chalk = require('chalk');
const MongoDB = require('mongodb');
const Config = require('../config');

const Red = Chalk.bold.red;
const Green = Chalk.bold.green;
const ObjectID = MongoDB.ObjectID;
const MongoClient = MongoDB.MongoClient;


function connect(params) {
    let {collection, ctrl, ops} = params;
    console.log(Green('\nparams:\n'), JSON.stringify(params), "\n");
    return new Promise((resolve, reject) => {
        MongoClient.connect(Config.dbUrl, Config.dbOptions).then((client) => {
            const DB = client.db(Config.dbName);
            const Collection = DB.collection(collection);
            let result = Collection[ctrl](...ops);
            if (ctrl === "find" || ctrl === "aggregate") result = result.toArray();
            result.then((data) => {
                resolve(data);
                client.close();
            }, (err) => {
                reject(err.toString());
                client.close();
                console.log(Red('mongodb collection ctrl error:\n'), err, "\n");
            });
        }, (err) => {
            reject(err.toString());
            console.log(Red('mongodb client connection error:\n'), err, "\n");
        }).catch((err) => {
            reject(err.toString());
            console.log(Red('mongodb client error:\n'), err, "\n");
        });
    });
}

module.exports = {
    connect,
    ObjectID
};