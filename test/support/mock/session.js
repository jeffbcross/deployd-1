var SessionStore = exports.SessionStore = function (namespace, db, sockets) {};

SessionStore.prototype.createUniqueIdentifier = function() {
  return 'foo';
};
SessionStore.prototype.createSession = function(sid, fn) {};
