const http = require("http");
const fs = require("fs");

const server = http.createServer((req, resp) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    const data = fs.readFileSync("./index.html");
    const text = data.toString().replace("{message}", "This is real message");
    resp.write(text);
    resp.end();
}).listen(3000);