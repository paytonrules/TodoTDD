describe("Tasks page - CRUD for tasks", function() {
  var http = require('http');
  var models = require("../../models");
  var expect = require('expect.js');
  var app = require("../../app.js");

  before(function() {
    app.start(8888);
  });

  after(function() {
    app.stop();
  });

  beforeEach(function() {
    return models.sequelize.sync().then(function() {
      return models.User.destroy({truncate: true});
    }).then(function() {
      return models.Task.destroy({truncate: true});
    });
  });

  describe("get /users/:userid/tasks", function() {

    it("should list all the tasks for a user", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        user.createTask({title: "task 1"}).then(function() {
          return user.createTask({title: "task 2"});
        }).then(function() {
          http.get('http://localhost:8888/users/' + user.id + '/tasks', function(res) {
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.equal('html');
            res.on('data', function(body) {
              expect(body.toString()).to.contain('task 1');
              expect(body.toString()).to.contain('task 2');
              done();
            });
          });
        });
      });
    });

    it("should not list tasks for unlinked users", function(done) {
      var user;
      models.User.create({username: "Eric"}).then(function(newUser) {
        user = newUser;
        return models.Task.create({title: "task 1"});
      }).then(function(task) {
        http.get('http://localhost:8888/users/' + user.id + '/tasks', function(res) {
          res.on('data', function(body) {
            expect(body.toString()).not.to.contain('task 1');
            done();
          });
        });
      });
    });

    it("includes the user in the response body for the form", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        http.get('http://localhost:8888/users/' + user.id + '/tasks', function(res) {
          res.on('data', function(body) {
            expect(body.toString()).to.contain("/users/" + user.id + "/tasks");
            done();
          });
        });
      });
    });
  });

  describe("post /users/:userid/tasks", function() {

    it("should redirect back to the tasks page after a post", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        var indexLink = '/users/' + user.id + '/tasks/';

        var requestOptions = {
          hostName: "localhost",
          path: indexLink,
          port: 8888,
          method: 'POST',
          headers: {
          }
        };
        console.log("DO REQUEST");
        http.request(requestOptions, function(res) {
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.match(/users/);
        });
      });
    });

    xit("should create a task for that user id with the passed in title", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        indexLink = '/users/' + user.id + '/tasks/';

        request(app)
          .post(indexLink)
          .send({'title' : 'Write Todolist app'})
          .end(function(err, res) {
            models.Task.findOne({where: {UserId: user.id}}).then(function(task) {
              expect(task.title).to.equal("Write Todolist app");
              done();
            });
          });
      });
    });
  });

  xdescribe("delete /users/:userid/tasks/:taskid", function(done) {
    it("should redirect back to the tasks page after a post", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        return user.createTask({title: "finish chapter"});
      }).then(function(task) {
        indexLink = '/users/' + task.UserId + '/tasks/';
        deleteLink = indexLink + task.id;

        request(app)
          .del(deleteLink)
          .expect(302, new RegExp(indexLink + "$"), done);
      });
    });

    it("should delete the passed in task (duh)", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        return user.createTask({title: "finish chapter"});
      }).then(function(task) {
        indexLink = '/users/' + task.UserId + '/tasks/';
        deleteLink = indexLink + task.id;

        request(app)
          .del(deleteLink)
          .end(function(_, res) {
            models.Task.findById(task.id).then(function(task) {
              expect(task).to.be(null);
              done();
            });
          });
      });
    });
  });
});
