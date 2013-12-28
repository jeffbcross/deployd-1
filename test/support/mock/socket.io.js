var EventEmitter = require('events').EventEmitter;
var util = require('util');
var io = module.exports = {};
var Sockets = function () {};
util.inherits(Sockets, EventEmitter);

var sockets = new Sockets();

io.listen = function () { return {sockets: sockets}};

