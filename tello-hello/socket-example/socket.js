const http = require("http");
const url = require('url');
const fs = require('fs');
const io = require('socket.io')(http);

const server = http.createServer(function(request, response) {
    console.log('Connected');
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

function randNum(){
    return { 'message': Math.random() * 100 };
}
server.listen(8080);

const serv_io = io.listen(server);

serv_io.sockets.on('connection', function(socket) {
    setInterval(() => {
        // emit 第一個參數與 browser 的 socket.on() 的第一個參數要相同
        // emit 的第二個參數是 callback function
        socket.emit('randomNum', randNum());
    }, 1000)
});