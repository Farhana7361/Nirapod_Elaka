const express = require("express");
const router = express.Router();
const { registerUser, loginUser, checkEmail, resetPassword,changePassword } = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/check-email", checkEmail);
router.post("/reset-password", resetPassword);
router.put("/change-password", changePassword);

module.exports = router;