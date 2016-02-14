var http = require("http");
var models = require("./models");
var querystring = require('querystring');
var server;

var redirect = function(response, path) {
  response.writeHead(302, {
    'Location': '/users/'
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
      tasks.forEach(function(task) {
        responseText += '<p>' + task.title + '</p>\n';
      });
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
          findAllTasks(request, response);
        } else {
          var parts = request.url.split('/');
          var data = '';
          request.on('data', function(chunk) {
            data += chunk;
          });
          request.on('end', function() {
            var params = querystring.parse(data.toString());
            console.log(parts[2]);
            models.Task.create({
              UserId: parts[2],
              title: params.title
            }).then(function() {
              redirect(response, '/users/');
            });
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

