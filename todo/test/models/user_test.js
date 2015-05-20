describe("User Model", function() {
  var models = require("../../models");
  var expect = require("expect.js");

  before(function() {
    return models.sequelize.sync().then(function() {
      return models.User.destroy();
    }).then(function() {
      return models.Task.destroy();
    });
  });

  it("can be built with a username", function(done) {
    models.User.create({username: "Eric"}).then(function(builtUser) {
      expect(builtUser.username).to.equal("Eric");
      done();
    });
  });

  it("has many tasks", function(done) {
    models.User.create({username: "Eric"}).then(function(createdUser) {
      createdUser.getTasks().then(function(tasks) {
        expect(tasks.length).to.be(0);
        return createdUser.createTask();
      }).then(function() {
        return createdUser.getTasks();
      }).then(function(tasks) {
        expect(tasks.length).to.be(1);
        done();
      });
    });
  });
});
