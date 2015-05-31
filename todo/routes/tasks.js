"use strict"

var express = require('express');
var router = express.Router({mergeParams: true});
var models = require("../models");

router.get('/', function(req, res, next) {
  models.Task.findAll({where: {UserId: req.params.userId}}).then(function(tasks) {
    res.render('tasks', { userId: req.params.userId, tasks: tasks});
  });
});

router.post('/', function(req, res, next) {
  models.Task.create({title: req.body.title,
                     UserId: req.params.userId}).then(function(task) {
    res.redirect('/users/' + req.params.userId + '/tasks/');
  });
});

router.delete('/:taskId', function(req, res, next) {
  models.Task.destroy({where: {id: req.params.taskId}}).then(function() {
    res.redirect('/users/' + req.params.userId + '/tasks/');
  });
});

module.exports = router;
