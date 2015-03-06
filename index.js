var Redis = module.exports = require("./lib/redis");

/**
 * create toshihiko redis
 * @param {String} servers the servers addresses
 * @param {Object} options the redis options
 * @return {Redis} the redis wrapper
 */
module.exports.create = function(servers, options) {
    return new Redis(servers, options);
};