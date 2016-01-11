var express = require('express');
var router = express.Router();
var models = require("../models");

router.get('/', function(req, res, next) {
  res.redirect('/users');

});

module.exports = router;
