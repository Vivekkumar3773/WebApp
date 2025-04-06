const express = require("express");
const dotenv = require("dotenv");
const connectDb = require('./lib/db');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/message");
const { app, server } = require("./lib/socket");

dotenv.config();

const PORT = process.env.PORT;

// ✅ No need to define __dirname in CommonJS!

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
    // __dirname is already available
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res, next) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

try {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
        connectDb();
    });
} catch (err) {
    console.error("Server failed to start:", err);
}