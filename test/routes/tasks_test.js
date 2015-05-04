describe("Tasks page - CRUD for tasks", function() {
  var http = require('http');
  var models = require("../../models");
  var expect = require('expect.js');
  var app = require("../../app.js");
  var querystring = require("querystring");

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
            res.on('data', function(chunk) {
              expect(chunk.toString()).to.contain('task 1');
              expect(chunk.toString()).to.contain('task 2');
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
          headers: {}
        };
        var request = http.request(requestOptions, function(res) {
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.match(/users/);
          done();
        });
        request.write(querystring.stringify({}));
        request.end();
      });
    });

    it("should create a task for that user id with the passed in title", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        indexLink = '/users/' + user.id + '/tasks/';

        var requestOptions = {
          hostname: "localhost",
          path: indexLink,
          port: 8888,
          method: 'POST',
          headers: {}
        };
        var request = http.request(requestOptions, function(res) {
          models.Task.findOne({where: {UserId: user.id}}).then(function(task) {
            expect(task.title).to.equal("Write Todolist app");
          });
          done();
        });
        request.write(querystring.stringify({'title' : 'Write Todolist app'}));
        request.end();
      });
    });
  });

  describe("delete /users/:userid/tasks/:taskid", function(done) {
    it("should redirect back to the tasks page after a delete", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        return user.createTask({title: "finish chapter"});
      }).then(function(task) {
        indexLink = '/users/' + task.UserId + '/tasks/';
        deleteLink = indexLink + task.id;

        var requestOptions = {
          hostname: 'localhost',
          path: deleteLink,
          port: 8888,
          method: 'POST',
          headers: {}
        };
        var request = http.request(requestOptions, function(res) {
          var expectedRedirect = new RegExp(indexLink + "$");
          expect(res.statusCode).to.equal(302);
          expect(res.headers.location).to.match(expectedRedirect);
          done();
        });
        request.write(JSON.stringify({_method: 'DELETE'}));
        request.end();
      });
    });

    it("should delete the passed in task (duh)", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        return user.createTask({title: "finish chapter"});
      }).then(function(task) {
        indexLink = '/users/' + task.UserId + '/tasks/';
        deleteLink = indexLink + task.id;

        var requestOptions = {
          hostname: 'localhost',
          path: deleteLink,
          port: 8888,
          method: 'POST',
          headers: {}
        };
        var request = http.request(requestOptions, function(res) {
          models.Task.findOne({where: {id: task.id}}).then(function(task) {
            expect(task).to.equal(null);
            done();
          });
        });
        request.write(JSON.stringify({_method: 'DELETE'}));
        request.end();
      });
    });

    it('only deletes the task passed in', function(done) {
      var task1, task2, createdUser;
      models.User.create({username: "Eric"}).then(function(user) {
        createdUser = user;
        return user.createTask({title: "finish chapter"});
      }).then(function(task) {
        task1 = task;
        return createdUser.createTask({title: "start next chapter"});
      }).then(function(task) {
        task2 = task;
        indexLink = '/users/' + task2.UserId + '/tasks/';
        deleteLink = indexLink + task2.id;

        var requestOptions = {
          hostname: 'localhost',
          path: deleteLink,
          port: 8888,
          method: 'POST',
          headers: {}
        };
        var request = http.request(requestOptions, function(res) {
          models.Task.findOne({where: {id: task2.id}}).then(function(deletedTask) {
            expect(deletedTask).to.equal(null);
            return models.Task.findOne({where: {id: task1.id}});
          }).then(function(foundTask) {
            expect(foundTask.id).to.equal(task1.id);
            done();
          });
        });
        request.write(JSON.stringify({_method: 'DELETE'}));
        request.end();
      });
    });
  });
});
