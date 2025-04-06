const mongoose = require("mongoose");

module.exports = connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongoodb Connected Successfully On: ${conn.connection.host}`);
    } catch (error) {
        console.log("Mongodb connection error:", error);
    }
};