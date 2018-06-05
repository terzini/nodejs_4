const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200);
    req.pipe(res);
}).listen(3000);