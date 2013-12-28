var util = require('util')
  , EventEmitter = require('events').EventEmitter;

var MockServer = module.exports = function () {}
util.inherits(MockServer, EventEmitter);

MockServer.prototype.listen = function () {}
