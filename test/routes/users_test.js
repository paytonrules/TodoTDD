xdescribe("Users page - CRUD for users", function() {
  var request = require('supertest');
  var models = require("../../models");
  var expect = require('expect.js');
  var app = require("../../app.js");

  beforeEach(function() {
    return models.sequelize.sync().then(function() {
      return models.User.destroy({truncate: true});
    });
  });

  describe("get /users", function() {

    it("renders all the users as a link to their tasks", function(done) {
      models.User.create({username: "Eric"}).then(function(user1) {
        models.User.create({username: "Paytonrules"}).then(function(user2) {
          var firstUserLink = new RegExp('<a href="/users/' + user1.id + '/tasks">');
          var secondUserLink = new RegExp('<a href="/users/' + user2.id + '/tasks">');

          request(app)
            .get('/users')
            .expect('Content-Type', /html/)
            .expect(/Eric/)
            .expect(/Paytonrules/)
            .expect(firstUserLink)
            .expect(secondUserLink)
            .expect(200, done);
        });
      });
    });
  });

  describe("post /users", function() {
    it("creates a user", function(done) {
      request(app)
        .post("/users")
        .type('form')
        .send({'username': 'paytonrules'})
        .expect(302, /to \/users/)
        .end(function(err, res) {
          if (err) return done(err);

          models.User.findAll({}).then(function(users) {
            expect(users.length).to.be(1);
            expect(users[0].username).to.be('paytonrules');
            done();
          }).catch(function(err) {
            done(err);
          });
        });
    });
  });
});
