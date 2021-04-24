const http = require("http");
const url = require('url');
const fs = require('fs');
const io = require('../node_modules/socket.io')(http);

const server = http.createServer(function(request, response) {
    console.log('Connection');
    const path = url.parse(request.url).pathname;

    switch (path) {
        case '/':
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.write('I don\'t need to reload~');
            response.end(); d
            break;
        case '/socket.html':
            fs.readFile(__dirname + path, function(error, data) {
                if (error) {
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                } else {
                    response.writeHead(200, { "Content-Type": "text/html" });
                    response.write(data, "utf8");
                }
                response.end();
            });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(8080);

const serv_io = io.listen(server);

serv_io.sockets.on('connection', function(socket) {
    setInterval(() => {
        socket.emit('randomNum', { 'message': Math.random() * 100 });
    }, 1000)
});