describe("Index page - routes right to users routes", function() {
  var express = require('express');
  var request = require('supertest');
  var expect = require('expect.js');
  var app = require("../../app.js");

  describe("get /", function() {
    it ("redirects to users/", function(done) {
      request(app)
        .get('/')
        .expect(302, /\/users/, done);
    });
  });
});
