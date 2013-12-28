var rewire = require('rewire')
  ,	Server
  ,	Db = require('../lib/db').Db
  ,	Store = require('./support/mock/db').Store
  ,	Router = require('../lib/router')
  ,	sh = require('shelljs')
  ,	sinon = require('sinon')
  , MockServer = require('./support/mock/http.Server')
  , mockDB = require('./support/mock/db')
  , mockSocketIO = require('./support/mock/socket.io')
  , MockSessionStore = require('./support/mock/session').SessionStore;

describe('Server', function() {
  beforeEach(function () {
    Server = rewire('../lib/server');

    Server.__set__('process', {});
    Server.__set__('http', {
      Server: MockServer
    });
    Server.__set__('db', mockDB);
    Server.__set__('io', mockSocketIO);
    Server.__set__('SessionStore', MockSessionStore);
  });


  describe('constructor', function () {
    it('should configure server with options if provided', function () {
      var options = {
        port: 80,
        db: {
          port: 90,
          host: '0.0.0.0',
          name: 'fakedb'
        }
      };
      var server = new Server(options);

      expect(server.options.port).to.equal(80);
      expect(server.options.db).to.equal(options.db);
    });

    it('should configure server with defaults if no options provided', function () {
      var server = new Server();
      expect(server.options.port).to.equal(2403);
      expect(server.options.db.name).to.equal('deployd');
    });

    it('should create a stores map', function () {
      var server = new Server();

      expect(server.stores).to.be.an('object');
    });

    it('should instantiate a db on the server object', function () {
      var server = new Server({
        db: {
          port: 1234,
          name: 'mock',
          host: '0.0.0.0'
        }
      });

      expect(server.db.port).to.eql(1234);
      expect(server.db.name).to.eql('mock');
      expect(server.db.host).to.eql('0.0.0.0');
    });


    it('should instantiate socket.io and add sockets to server object', function () {
      var server = new Server();

      expect(typeof server.sockets).to.eql('object');
    });

    it('should set sessions on the server object', function () {
      var server = new Server();
      expect(server.sessions).to.be.an('object');
    });

    it('should set keys on the server object', function () {
      var server = new Server();
      expect(server.keys).to.be.an('object');
    });

    it('should listen to request:error on server and kill process', function () {
      var spy = sinon.spy();
      Server.__set__('process', {
        exit: spy
      });
      Server.__set__('console', {
        error: function () {},
        log: function () {}
      });

      var server = new Server();
      server.emit('request:error', new Error(), {}, {});

      expect(spy.callCount).to.eql(1);
      });
  });


  describe('.listen()', function() {
    beforeEach(function() {
      sh.cd('./test/support/proj');
      sh.rm('-rf', 'resources');
      sh.mkdir('resources');
    });

    it('should start a new deployd server', function() {
      var PORT = genPort();
      var opts = {
          port: PORT,
          db: {
            name: 'deployd',
            port: 27017,
            host: '127.0.0.1'
          }
      };
      var spy = sinon.spy();
      Server.__set__('config', {
        loadConfig: spy
      });
      var server = new Server(opts);


      server.listen();

      expect(spy.callCount).to.eql(1);
    });

    afterEach(function() {
      sh.cd('../../../');
    });
  });


  describe('.createStore(namespace)', function() {
    it('should create a store with the given name', function() {
      var server = new Server()
        ,	store = server.createStore('foo');

      expect(store instanceof Store).to.equal(true);
      expect(server.stores.foo).to.equal(store);
    });
  });


  describe('.route()', function () {
    it('should be on the prototype', function () {
      var server = new Server();
      expect(typeof server.route).to.equal('function');
      expect(server.route.toString()).to.contain('req, res');
    });


    it('should call config.loadConfig', function () {
      var server = new Server();
      var req = {url: 'foo'};
      var res = {body: 'bar'};
      var config = require('../lib/config-loader');
      config.loadConfig = sinon.spy();

      server.route(req, res);

      expect(config.loadConfig.callCount).to.equal(1);
    });


    it('should set a resources array on the server', function () {
      var server = new Server();
      var req = {url: 'foo', headers: {accept: '*'}};
      var res = {body: 'bar', on: function () {}};

      var configLoader = require('../lib/config-loader');
      configLoader.loadConfig = function (path, server, callback) {
        callback.call(server, null, ['foo']);
      };

      expect(Array.isArray(server.resources)).to.equal(false);

      server.route(req, res);

      expect(Array.isArray(server.resources)).to.equal(true);
    });
  });


  describe('.handleRequest()', function () {
    it('should be on the prototype', function () {
      var server = new Server();
      expect(typeof server.handleRequest).to.equal('function');
      expect(server.handleRequest.toString()).to.contain('req, res');
    });
  });
});
