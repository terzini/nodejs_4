const http = require("http");

const server = http.createServer((req, resp) => {
    res.writeHead(200, {'Content-Type': 'plain text'});
    resp.write("Hello World");
    resp.end();
}).listen(3000);