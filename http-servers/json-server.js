const http = require("http");

const product = {
    id: 1,
    name: 'Supreme T-Shirt',
    brand: 'Supreme',
    price: 99.99,
    options: [
        { color: 'blue' },
        { size: 'XL' }
    ]
 };
 

const server = http.createServer((req, resp) => {
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.write(JSON.stringify(product));
    resp.end();
}).listen(3000);

