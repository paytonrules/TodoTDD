describe("Tasks page - CRUD for tasks", function() {
  var request = require('supertest');
  var models = require("../../models");
  var expect = require('expect.js');
  var app = require("../../app.js");

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
        models.Task.create({title: "task 1"}).then(function(task) {
          return task.setUser(user);
        }).then(function(task) {
          return models.Task.create({title: "task 2"});
        }).then(function(task) {
          return task.setUser(user);
        }).then(function() {
          request(app)
            .get('/users/' + user.id + '/tasks')
            .expect('Content-Type', /html/)
            .expect(/task 1/)
            .expect(/task 2/)
            .expect(200, done);
        });
      });
    });

    it("should not list tasks for other users", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        models.Task.create({title: "task 1"}).then(function(task) {
          return task.setUser(user);
        }).then(function() {
          var notTheUser = user.id + 1;
          request(app)
            .get('/users/' + notTheUser + '/tasks')
            .end(function(err, res) {
              expect(res.text).not.to.match(/task 1/);
            })
            .expect(200, done);
        })
      })
    });

    it("includes the user in the response body for the form", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        request(app)
          .get('/users/' + user.id + '/tasks')
          .end(function(err, res) {
            expect(res.text).to.contain("/users/" + user.id + "/tasks/");
            done();
          });
      });
    });
  });

  describe("post /users/:userid/tasks", function() {

    it("should redirect back to the tasks page after a post", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        indexLink = '/users/' + user.id + '/tasks/';

        request(app)
          .post(indexLink)
          .expect(302, new RegExp(indexLink), done);
      });
    });

    it("should create a task for that user id with the passed in title", function(done) {
      models.User.create({username: "Eric"}).then(function(user) {
        indexLink = '/users/' + user.id + '/tasks/';

        request(app)
          .post(indexLink)
          .send({'title' : 'Write Todolist app'})
          .end(function(err, res) {
            models.Task.findOne({where: {userId: user.id}}).then(function(task) {
              expect(task.title).to.equal("Write Todolist app");
              done();
            });
          });
      });
    });
  });
});
