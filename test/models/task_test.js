describe("Task Model", function() {
  var expect = require("expect.js");
  var models = require("../../models");

  before(function() {
    return models.sequelize.sync().then(function() {
      return models.User.destroy({truncate: true});
    }).then(function() {
      return models.Task.destroy({truncate: true});
    });
  });

  it("can be built with a title", function(done) {
    models.Task.create({title: "Write a book"}).then(function(task) {
      expect(task.title).to.equal("Write a book");
      done();
    });
  });

  it("belongs to a user", function(done) {
    models.Task.create({title: "book"}).then(function(task) {
      models.User.create({username: "Eric"}).then(function(user) {
        return task.setUser(user)
      }).then(function(task) {
        return task.getUser();
      }).then(function(user) {
        expect(user).to.be.ok();
        expect(user.username).to.equal("Eric");
        done();
      });
    });
  });
});
