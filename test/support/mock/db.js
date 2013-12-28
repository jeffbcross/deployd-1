var util = require('util')
  , EventEmitter = require('events').EventEmitter



function MockDB (options) {
  this.name = options && options.name;
  this.port = options && options.port;
  this.host = options && options.host;
}

MockDB.prototype.create = function (options) {
  return new MockDB(options);
};
MockDB.prototype.drop = function (fn) { fn.call(); };
MockDB.prototype.createStore = function (namespace) { return new this.Store()};

MockDB.prototype.Store = function () {};

var db = module.exports = new MockDB();
util.inherits(db, EventEmitter);
