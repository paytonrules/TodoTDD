describe("Users page - CRUD for users", function() {
  var models = require("../../models");
  var expect = require('expect.js');
  var app = require("../../app.js");
  var http = require("http");
  var queryString = require('querystring');

  before(function() {
    app.start(8888);
  });

  after(function() {
    app.stop();
  });

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

          http.get('http://localhost:8888/users/', function(res) {
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('html');
            res.on('data', function(chunk) {
              expect(chunk.toString()).to.contain('Eric');
              expect(chunk.toString()).to.contain('Paytonrules');
              expect(chunk.toString()).to.match(firstUserLink);
              expect(chunk.toString()).to.match(secondUserLink);
              done();
            });
          });
        });
      });
    });
  });

  describe("post /users", function() {
    it("creates a user", function(done) {
      var requestOptions = {
        hostName: 'localhost',
        path: '/users',
        port: 8888,
        method: 'POST',
        headers: {}
      };

      var request = http.request(requestOptions, function(res) {
        models.User.findOne({where: {username: 'paytonrules'}}).then(function(user) {
          expect(user).not.to.be(null);
          done();
        });
      });

      request.write(queryString.stringify({'username' : 'paytonrules'}));
      request.end();
    });
  });
});
