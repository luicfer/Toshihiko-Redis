var _Redis = require("ioredis");
var EventEmitter = require("events").EventEmitter;
var util = require("util");
var log = require("debug")("toshihiko-redis");

/**
 * Toshihiko Redis
 * @param {String} servers '127.0.0.1:6379'
 * @param {Object} options refer to https://github.com/mranney/node_redis#rediscreateclient, and you may give a prefix
 * @constructor
 */
var Redis = function (servers, options) {
    EventEmitter.call(this);
    servers = servers.split(':');
    this.prefix = (options && options.prefix) ? options.prefix : "";

    if (options) {
        delete options.prefix;
    }
    this.redis = new _Redis(servers[1], servers[0], options);
    log('create redis client');
};

util.inherits(Redis, EventEmitter);

/**
 * get key value
 * @param {String} dbName the database name
 * @param {String} tableName the table name
 * @param {String|Object} key the primary key
 * @return {String} the keyname in redis
 */
Redis.prototype._getKey = function (dbName, tableName, key) {
    var base = this.prefix + dbName + "_" + tableName;
    if (typeof key !== "object") return base + ":" + key;

    for (var i in key) {
        if (Object.prototype.hasOwnProperty.call(key, i)) {
            base += ":";
            base += i;
            base += key[i];
        }
    }
    return base;
};


/**
 * delete one cached data
 * @param {String} dbName database name
 * @param {String} tableName table name
 * @param {String|Object} key primary key
 * @param {Function} callback the callback function
 */
Redis.prototype.deleteData = function (dbName, tableName, key, callback) {
    key = this._getKey(dbName, tableName, key);
    this.redis.del(key, callback);
    log('del key %s', key);
};

/**
 * delete one or more cached data
 * @param {String} dbName database name
 * @param {String} tableName table name
 * @param {Array} keys primary keys array
 * @param {Function} callback the callback function
 */
Redis.prototype.deleteKeys = function (dbName, tableName, keys, callback) {
    var pipeline = this.redis.pipeline();
    var key = null;
    var self = this;
    for (var i = 0; i < keys.length; i++) {
        key = self._getKey(dbName, tableName, keys[i]);
        log('mdel key %s', key);
        pipeline.del(key);
    }
    pipeline.exec(function (err, res) {
        res = res.map(function (it) {
            return it[1];
        });
        callback(err, res);
    });
};

/**
 * set cached data
 * @param {String} dbName database name
 * @param {String} tableName table name
 * @param {String|Object} key the primary key
 * @param {Object} data the data
 * @param {Function} callback the callback function
 */
Redis.prototype.setData = function (dbName, tableName, key, data, callback) {
    key = this._getKey(dbName, tableName, key);
    log('set key %s', key);
    data = JSON.stringify(data);
    this.redis.set(key, data, callback);
};


/**
 * get data
 * @param {String} dbName database name
 * @param {String} tableName table name
 * @param {Array|String|Object} keys the primary key(s)
 * @param {Function} callback the callback function
 */
Redis.prototype.getData = function (dbName, tableName, keys, callback) {
    if (!util.isArray(keys)) {
        keys = [keys];
    }
    var pipeline = this.redis.pipeline();
    var key = null;
    var self = this;
    for (var i = 0; i < keys.length; i++) {
        key = self._getKey(dbName, tableName, keys[i]);
        log('get key %s', key);
        pipeline.get(key);
    }
    pipeline.exec(function (err, res) {
        res = res.filter(function (it) {
            return it !== null
        });
        res = res.map(function (it) {
            return JSON.parse(it[1])
        });
        callback(err, res)
    });
};

module.exports = Redis;


