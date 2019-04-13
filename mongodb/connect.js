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
  let {collection, ctrl, dbOptions} = params;
  console.log('\nMongoDB Params:\n'.green.bold, JSON.stringify(params), "\n");
  return MongoClient.connect(Config.dbUrl, Config.dbOptions).then(client => {
    const DB = client.db(Config.dbName);
    const Collection = DB.collection(collection);
    let result = Collection[ctrl](...dbOptions);
    if (ctrl === "find" || ctrl === "aggregate") result = result.toArray();
    client.close(false).catch((err) => {
      console.log('MongoDB Client Close Error:\n'.red.bold, err, "\n");
    });
    return result
  }).then(data => {
    return data
  }).catch(err => {
    console.log('MongoDB Client Error: ↓↓↓\n'.underline.red.bold);
    return Promise.reject(err)
  })
}

module.exports = {
  connect,
  ObjectID
};
