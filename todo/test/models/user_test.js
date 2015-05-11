var expect = require("expect.js");

describe("User Model", function() {
  var models = require("../../models");

  before(function() {
    return models.sequelize.sync()
  });

  it("can be created", function(done) {
    models.User.create({username: "Eric"}).then(function(createdUser) {
      expect(createdUser.username).to.equal("Eric");
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
