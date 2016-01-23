var http = require("http");
var server;

module.exports = {
  start: function(port) {
    server = http.createServer(function(request, response) {
      response.writeHead(302, {
        'Location': '/users/'
      });
      response.end();
    });
    server.listen(port);
  },

  stop: function() {
    server.close();
  }
};

