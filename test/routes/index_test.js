describe("Index page - routes right to users routes", function() {
  var http = require('http');
  var expect = require('expect.js');
  var app = require('../../server.js');
//  var server = require("../../server.js");
  var server;

  before(function() {
    app.start(8888);
    /*
     *server = http.createServer(function(request, response) {
     *  response.writeHead(302, {
     *    'Location': '/users/'
     *  });
     *  response.end();
     *});
     *server.listen(8888);
     */
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
