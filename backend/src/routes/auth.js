const express = require("express");

const authController = require('../controllers/authController');

const protectRoute = require('../middleware/auth.middleware');

const router = express.Router();

router.post("/signup", authController.postSignUp);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.put("/update-profile", protectRoute, authController.putUpdateProfile);

router.get("/check", protectRoute, authController.getcheckAuth);

module.exports = router;