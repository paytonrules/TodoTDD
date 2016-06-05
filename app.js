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

module.exports = {
  start: function(port) {
    server = http.createServer(function(request, response) {
      if (request.url === "/") {
        redirect(response, '/users/');
      } else {
        if (request.method === 'GET') {
          if (request.url === "/users/") {
            response.writeHead(200, {
              'content-type': 'html'
            });
            var responseText = '';
            models.User.findAll()
              .then(function(users) {
                var responseText = '';
                users.forEach(function(user) {
                  responseText += '<a href="/users/' + user.id + '/tasks">';
                  responseText += user.username;
                  responseText += '</a>';
                });
                response.write(responseText);
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

