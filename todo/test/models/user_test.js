var assert = require("assert");

describe("User Model", function() {

  it("can be created", function() {
    var models = require("../../models");

    var createdUser = models.User.create();

    assert.ok(createdUser);
  });
});
