var Server = require('../lib/server')
    sinon = require('sinon');

describe.only('Connect Middleware', function () {
  var req, res, next;

  beforeEach(function () {
    req = {url: 'foo', connection: {encrypted: false}, headers: {accept: '*'}};
    res = {body: 'bar', on: function () {}, setHeader: function () {}, getHeader: function () {}};
    next = sinon.spy();
  });

  it('should call next after handling the route', function (done) {
    var server = new Server();
    server.isTest = true;
    server.handleRequest(req, res, next);

    process.nextTick(function () {
      expect(next.callCount).to.equal(1);
      done();
    });
  });

  //Write some real tests to see that appropriate items are being added to req/res
  it('should work with the collection resource', function () {
    // expect(false).to.equal(true);
  });


  it('should work with the users collection', function () {

  });
});
