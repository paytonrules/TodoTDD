var http = require("http");
var models = require("./models");
var querystring = require('querystring');
var server;

var redirect = function(response, path) {
  response.writeHead(302, {
    'Location': path
  });
  response.end();
};

var findAllTasks = function(request, response) {
  var parts = request.url.split('/');
  models.Task.findAll({where: {UserId: parts[2]}})
    .then(function(tasks) {
      response.writeHead(200, {
        'content-type': 'html'
      });
      var responseText = '/users/' + parts[2] + '/tasks';
      tasks.forEach(function(task) { console.log(task); responseText += '<p>' + task.title + '</p>\n'; });
      response.write(responseText);
      response.end();
    });
};

var FILE_NOT_FOUND = 404;
var SUCCESS = 200;
var ROOT_PATH = "/";
var USERS_PATH = "/users/";
var GET_METHOD = "GET";
var TASKS_PATH = "/tasks";

module.exports = {
  start: function(port) {
    var self = this;
    server = http.createServer(function(request, response) {
      var FOUR_OR_FOUR_URL = "/thingthatwontexist";
      if (request.url === FOUR_OR_FOUR_URL) {
        response.writeHead(FILE_NOT_FOUND);
        response.end();
      } else if (request.url === ROOT_PATH) {
        redirect(response, USERS_PATH);
      } else {
        if (request.method === GET_METHOD) {
          if (request.url === USERS_PATH) {
            response.writeHead(SUCCESS, {
              'content-type': 'html'
            });
            models.User.findAll()
              .then(function(users) {
                var responseBody = '';
                users.forEach(function(user) {
                  responseBody += "<a href=\"" +  USERS_PATH  + user.id + TASKS_PATH + "\">";
                  responseBody += user.username;
                  responseBody += "</a>";
                });
                response.write(responseBody);
                response.end();
              });
          } else {
            findAllTasks(request, response);
          }
        } else {
          var parts = request.url.split('/');
          var data = '';
          request.on('data', function(chunk) {
            data += chunk;
          });
          request.on('end', function() {
            var json, params;
            try {
              json = JSON.parse(data.toString());
            } catch(e) {
              params = querystring.parse(data.toString());
            }

            if (json && json._method === 'DELETE') {
              models.Task.destroy({where: {id: parts[4]}}).then(function() {
                redirect(response, '/users/' + parts[2] + '/tasks/');
              });
            } else {
              if (parts[2] !== undefined) {
                models.Task.create({
                  UserId: parts[2],
                  title: params.title
                }).then(function() {
                  redirect(response, '/users/');
                });
              } else {
                models.User.create({
                  username: params.username
                }).then(function() {
                  response.end();
                });
              }
            }
          });
        }
      }
    });
    server.listen(port);
  },
  stop: function() {
    server.close();
  }
};

module.exports.findAllTasks = findAllTasks;



