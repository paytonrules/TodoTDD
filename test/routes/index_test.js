describe("Index page - routes right to users routes", function() {
  var http = require('http');
  var expect = require('expect.js');
  var app = require('../../server.js');

  before(function() {
    app.start(8888);
  });

  after(function() {
    app.stop();
  });

  describe("get /", function() {
    it ("redirects to users/", function(done) {
      http.get("http://localhost:8888", function(res) {
        expect(res.statusCode).to.equal(302);
        done();
      });
    });
  });
});
