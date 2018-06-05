export const cookieParser = (req, res, next) => {
    req.parsedCookieObj = req.headers.cookie;
    console.log("Parsed cookie:", req.parsedCookieObj);
    next();
}
