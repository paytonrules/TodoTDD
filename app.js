var http = require("http");
var server;

module.exports = {
  start: function(port) {
    server = http.createServer(function(request, response) {
      if (request.url === "/") {
        response.writeHead(302, {
          'Location': '/users/'
        });
      } else {
        response.writeHead(200, {
          'content-type': 'html'
        });
        response.write('task 1 task 2');
      }
      response.end();
    });
    server.listen(port);
  },

  stop: function() {
    server.close();
  }
};

