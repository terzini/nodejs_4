const express = require("express");
const app = express();

import { cookieParser, queryParser } from "./middlewares";

app
    .use(cookieParser)
    .use(queryParser);

app.route("/api/products")
    .get((req, resp) => {
        resp.send("All products")
    })
    .post((req, resp) => {
        resp.send(JSON.stringify(req.query));
    })

app.get("/api/products/:id", (req, resp, next) => {
    const id = req.params.id;
    resp.send(`Product with id=${id}`);
    next();
})

app.get("/api/products/:id/reviews", (req, resp, next) => {
    const id = req.params.id;
    resp.send(`Reviews for product with id=${id}`);
    next();
});

app.get("/api/users", (req, resp, next) => {
    resp.send("all users");
    next();
});

export default app;