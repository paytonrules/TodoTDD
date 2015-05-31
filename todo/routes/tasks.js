"use strict"

var express = require('express');
var router = express.Router({mergeParams: true});
var models = require("../models");

router.get('/', function(req, res, next) {
  models.Task.findAll({where: {userId: req.params.userId}}).then(function(tasks) {
    res.render('tasks', { userId: req.params.userId, tasks: tasks});
  });
});

router.post('/', function(req, res, next) {
  models.User.findById(req.params.userId).then(function(user) {
    models.Task.create({title: req.body.title}).then(function(task) {
      return task.setUser(user);
    }).then(function() {
      res.redirect('/users/' + req.params.userId + '/tasks/');
    });
  });
});

router.delete('/:taskId', function(req, res, next) {
  res.redirect('/users/' + req.params.userId + '/tasks/');
});

module.exports = router;
