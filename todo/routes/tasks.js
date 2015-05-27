var express = require('express');
var router = express.Router({mergeParams: true});
var models = require("../models");

router.get('/', function(req, res, next) {
  models.Task.findAll({userId: req.params.user}).then(function(tasks) {
    res.render('tasks', { tasks: tasks});
  });
});

module.exports = router;
