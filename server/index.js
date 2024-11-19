const express = require('express');
const dbConnect = require('./config/dbConnect');
const cors = require('cors')
const { DateTime } = require('luxon');
const { app, io, server } = require('./socket/socket.js');
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const productCatRouter = require('./routes/productCatRoute');
const blogCatRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');
const uploadRouter = require("./routes/uploadRoute");
const supplierRouter = require("./routes/supplierRoute");
const shipRouter = require("./routes/shipRoute");
const receiptRouter = require("./routes/receiptRoute");
const dashboardRouter = require("./routes/dashboardRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const cookieParser = require('cookie-parser');
const { notFound, errorHandle } = require('./middlewares/errorHandler');
const morgan = require('morgan');

dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use("/api/upload", uploadRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', productCatRouter);
app.use('/api/blogcategory', blogCatRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/supplier', supplierRouter);
app.use('/api/ship', shipRouter);
app.use('/api/receipt', receiptRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/chats', chatRoute)
app.use('/api/messages/', messageRoute)



app.use(notFound);
app.use(errorHandle);

server.listen(PORT, () => {
    console.log(`Backend Nodejs App listening on port ${PORT}`)
})
