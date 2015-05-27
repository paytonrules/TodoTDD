describe("Tasks page - CRUD for tasks", function() {
  var request = require('supertest');
  var models = require("../../models");
  var expect = require('expect.js');
  var app = require("../../app.js");

  beforeEach(function() {
    return models.sequelize.sync().then(function() {
      return models.User.destroy();
    }).then(function() {
      return models.Task.destroy();
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
  });
});
