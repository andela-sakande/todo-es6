import { MongoClient, ObjectID } from 'mongodb';
import assert from 'assert';
import chalk from 'chalk';

const dbName = 'crud_mongodb';
const url = 'mongodb://localhost:27017';
const mongoOptions = { useNewUrlParser: true };

let db = null;

const connect = (cb) => {
  MongoClient.connect(url, mongoOptions, (err, client) => {
    assert.strictEqual(null, err);
    /* eslint-disable no-console */
    console.log(chalk.red('Connected successfully to server'));
    db = client.db(dbName);
    cb();
  });
};

const getPrimaryKey = _id => ObjectID(_id);
const getDB = () => db;

module.exports = { getDB, getPrimaryKey, connect };
