const express = require("express");
const app = express();

import { cookieParser, queryParser } from "./middlewares";

app
    .use(cookieParser)
    .use(queryParser);

app.route("/api/products")
    .get((req, res) => {
        res.send("All products")
    })
    .post((req, res) => {
        res.send(JSON.stringify(req.query));
    })

app.get("/api/products/:id", (req, res, next) => {
    const id = req.params.id;
    res.send(`Product with id=${id}`);
    next();
})

app.get("/api/products/:id/reviews", (req, res, next) => {
    const id = req.params.id;
    res.send(`Reviews for product with id=${id}`);
    next();
});

app.get("/api/users", (req, res, next) => {
    res.send("All users");
    next();
});

export default app;