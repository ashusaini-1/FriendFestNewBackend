const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const user = require("./routes/userRoutes");
const chatRoutes=require('./routes/chatRoutes');
const messageRoutes=require('./routes/messageRoutes')
dotenv.config({ path: "config/config.env" });


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use("/api/user", user);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

module.exports = app;
