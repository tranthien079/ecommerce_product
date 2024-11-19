// Không tìm thấy

const notFound = (req, res, next) => {
    const error = new Error(`Không tìm thấy: ${req.originalUrl}`);
    res.status(404);
    next(error);
}
// Lỗi xử lý
const errorHandle = (err, req, res, next) => {
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode == 404 ? 404 : res.statusCode;
    res.status(statuscode);
    res.json({
        message: err?.message,
        stack: err?.stack
    });
}

module.exports = {
    notFound,
    errorHandle
};