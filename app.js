var http = require("http");
var models = require("./models");
var server;

module.exports = {
  start: function(port) {
    server = http.createServer(function(request, response) {
      console.log("REQUEST");
      if (request.url === "/") {
        response.writeHead(302, {
          'Location': '/users/'
        });
        response.end();
      } else {
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
      }
    });
    server.listen(port);
  },

  stop: function() {
    server.close();
  }
};

