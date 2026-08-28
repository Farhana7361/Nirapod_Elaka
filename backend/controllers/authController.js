const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, identity } = req.body;

        // 1. Check all fields are provided
       if (!name || !email || !password || !identity) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create the user in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            identity,
        });

        // 5. Create a login token for this new user
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        // 6. Send back the user info + token (never send the password back!)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            identity: user.identity,
            token,
        });
    } catch (err) {
        console.log("Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};



const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Keep this generic — don't reveal whether the email exists
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
             identity: user.identity,
            token,
        });
    } catch (err) {
        console.log("Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, loginUser };