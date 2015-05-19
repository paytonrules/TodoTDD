describe("Index routes", function() {
  var express = require('express');
  var request = require('supertest');
  var router = require("../../routes/index.js");
  var path = require('path');

  it("renders all the users", function(done) {
    var app = express();
    var views = __dirname + "/../../views";
    app.set('views', path.join(__dirname, '/../../views'));
    app.set('view engine', 'jade');
    app.use(router);

    request(app)
      .get('/')
      .expect(200, done);
  });
});
