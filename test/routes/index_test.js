describe("Index page - routes right to users routes", function() {
  var http = require('http');
  var expect = require('expect.js');
  var app = require('../../app.js');

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
        expect(res.headers['location']).to.equal('/users/');
        done();
      });
    });

    it ("returns a 404 for non-existent paths", function(doneringdong) {
      http.get("http://localhost:8888/thingthatwontexist", function(res) {
        expect(res.statusCode).to.equal(404);
        doneringdong();
      });
    });
  });
});
