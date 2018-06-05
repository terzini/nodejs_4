const http = require("http");
const fs = require("fs");
const through2 = require("through2");

const FILE_PATH = "./index.html";
const REAL_MESSAGE = "This is real message";

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    // res.write(sendFileSync());
    // res.end();
    pipeFileAsync(res);
}).listen(3000);

function sendFileSync() {
    const data = fs.readFileSync(FILE_PATH);
    const text = data.toString().replace(/{message}/g, REAL_MESSAGE);
    return text;
}

function pipeFileAsync(res) {
    fs.createReadStream(FILE_PATH).pipe(
        through2(function (chunk, enc, cb) {
            this.push(chunk.toString().replace(/{message}/g, REAL_MESSAGE));
            cb();
        }))
        .pipe(res);
}
