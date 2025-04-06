const jwt = require('jsonwebtoken');
const Users = require('../models/user.model');

module.exports = protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ message: "Unauthorized -No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized -Token Invalid" });
        }

        const user = await Users.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log("Error in protectRoute", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}