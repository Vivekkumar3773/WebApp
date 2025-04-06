const Users = require('../models/user.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../lib/utils');
const cloudinary = require('../lib/cloudinary');

exports.postSignUp = async (req, res, next) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All Fields Are Required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const userExists = await Users.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email Already Exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            fullName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic || null
        });

    } catch (error) {
        console.error("Error in SignUp controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.postLogout = (req, res, next) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged Out Successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internel Server Error" });
    }
};

exports.putUpdateProfile = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile Pic Is Require" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateUser = await Users.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json(updateUser)

    } catch (error) {
        console.log("Error in update ProfilePic", error.message);
        res.status(400).json({ message: "Internal Server Error" });
    }
}

exports.getcheckAuth = (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        return res.status(400).json({ message: "Internal Server Error" })
    }
}