describe("Index routes", function() {
  var express = require('express');
  var request = require('supertest');
  var router = require("../../routes/index");
  var path = require('path');
  var models = require("../../models");
  var app;

  before(function() {
    app = express();
    var views = __dirname + "/../../views";
    app.set('views', path.join(__dirname, '/../../views'));
    app.set('view engine', 'jade');
    app.use(router);

    return models.sequelize.sync().then(function() {
      return models.User.destroy();
    });

  });

  it("renders all the users", function(done) {
    models.User.create({username: "Eric"}).then(function() {
      models.User.create({username: "Paytonrules"}).then(function() {

        request(app)
          .get('/')
          .expect('Content-Type', /html/)
          .expect(/Eric/)
          .expect(/Paytonrules/)
          .expect(200, done);
      });
    });
  });
});
