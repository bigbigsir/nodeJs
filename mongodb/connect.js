/**
 * Created by: MoJie
 * Date: 2019/1/15
 */
'use strict';

require('colors');
const MongoDB = require('mongodb');
const Config = require('../config');

const ObjectID = MongoDB.ObjectID;
const MongoClient = MongoDB.MongoClient;


function connect(params) {
  let {collection, ctrl, ops} = params;
  console.log('\nparams:\n'.green.bold, JSON.stringify(params), "\n");
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
        console.log('mongodb collection ctrl error:\n'.red.bold, err, "\n");
      });
    }, (err) => {
      reject(err.toString());
      console.log('mongodb client connection error:\n'.red.bold, err, "\n");
    }).catch((err) => {
      reject(err.toString());
      console.log('mongodb client error:\n'.red.bold, err, "\n");
    });
  });
}

module.exports = {
  connect,
  ObjectID
};
