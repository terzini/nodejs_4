export const cookieParser = (req, resp, next) => {
    req.parsedCookieObj = req.headers.cookie;
    next();
}
