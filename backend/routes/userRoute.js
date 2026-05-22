const express = require("express");
const {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/userController");

//router object
const router = express.Router();

//routers
// POST || LOGIN USER
router.post("/login", loginController);

//POST || REGISTER USER
router.post("/register", registerController);

//POST || FORGOT PASSWORD (email a reset link)
router.post("/forgot-password", forgotPasswordController);

//POST || RESET PASSWORD (with token)
router.post("/reset-password", resetPasswordController);

module.exports = router;
