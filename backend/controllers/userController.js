const userModel = require("../models/userModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// login callback
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email, password });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Login failed. Please try again.",
    });
  }
};

//Register Callback
const registerController = async (req, res) => {
  try {
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).json({
      success: true,
      newUser,
    });
  } catch (error) {
    // Duplicate key (email already registered)
    if (error && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists. Please log in instead.",
      });
    }
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed. Please try again.",
    });
  }
};

// Forgot password - generate a reset token and email a reset link
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await userModel.findOne({ email });

    // Only act if the user exists, but always return the same response so we
    // don't reveal which emails are registered.
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
      await user.save();

      const clientUrl =
        process.env.CLIENT_URL || "https://money-manager-byakshat.vercel.app";
      const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
          <h2 style="color:#4f46e5">Reset your password</h2>
          <p>Hi ${user.name || "there"}, we received a request to reset your
             Expense Manager password.</p>
          <p>Click the button below to choose a new password. This link
             expires in <b>1 hour</b>.</p>
          <p style="margin:24px 0">
            <a href="${resetUrl}"
               style="background:#6366f1;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none">
               Reset Password</a>
          </p>
          <p style="color:#64748b;font-size:13px">
            If the button doesn't work, paste this link into your browser:<br>${resetUrl}
          </p>
          <p style="color:#64748b;font-size:13px">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>`;

      try {
        await sendEmail({
          to: user.email,
          subject: "Reset your Expense Manager password",
          html,
        });
      } catch (mailErr) {
        console.log("Email send failed:", mailErr.message);
        // roll back the token so a stale one isn't left behind
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return res.status(500).json({
          success: false,
          message: "Could not send the reset email. Please try again later.",
          detail: mailErr.message, // TEMP: for debugging, removed after diagnosis
        });
      }
    }

    res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

// Reset password - validate the token and set the new password
const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    user.password = password; // stored as-is, consistent with the current app
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  forgotPasswordController,
  resetPasswordController,
};
