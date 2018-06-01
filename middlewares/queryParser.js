export const queryParser = (req, resp, next) => {
    req.parsedQuery = req.query;
    next();
}