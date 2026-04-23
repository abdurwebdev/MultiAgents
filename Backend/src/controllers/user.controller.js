import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import redisClient from "../config/redis.js";
import logger from "../config/logger.js";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../config/mailer.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const cachedUser = await redisClient.get(`user_profile:${userId}`);

    if (cachedUser) {
      const user = JSON.parse(cachedUser);

      // 🔥 EXTRA SAFETY: prevent stale unverified access
      if (!user.verified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email",
        });
      }

      return res.status(200).json({
        success: true,
        message: "user fetched successfully from cache",
        user,
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    const TWO_DAYS = 2 * 24 * 60 * 60;

    await redisClient.setEx(
      `user_profile:${userId}`,
      TWO_DAYS,
      JSON.stringify(user)
    );

    return res.status(200).json({
      success: true,
      message: "user fetched successfully.",
      user,
    });
  } catch (error) {
    logger.error(`Error Fetching Profile:${error.message}`, {
      userId: req.user?.id,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    const isEmailChanging = email && email !== currentUser.email;

    if (isEmailChanging) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use.",
        });
      }
    }

    // 🔥 Apply updates manually (cleaner + safer)
    if (name) currentUser.name = name;
    if (email) currentUser.email = email;

    if (isEmailChanging) {
      currentUser.verified = false;

      const token = jwt.sign(
        { id: userId, type: "email-verification" },
        process.env.JWT_SECRET,
        { expiresIn: "7h" }
      );

      await sendVerificationEmail(email, token);

      await redisClient.del(`user_token:${userId}`);
      res.clearCookie("token");
    }

    await currentUser.save();

    // 🔥 Clear cache AFTER save
    await redisClient.del(`user_profile:${userId}`);

    return res.status(200).json({
      success: true,
      message: isEmailChanging
        ? "Profile updated. Please verify your new email."
        : "Profile updated successfully.",
      user: currentUser,
    });
  } catch (error) {
    logger.error(`Error Updating Profile:${error.message}`, {
      userId: req.user?.id,
    });

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;

    let { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({
          success: false,
          message: "both passsword fields are required.",
        });
    }
    let user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    let isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "old password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await redisClient.del(`user_token:${userId}`);
    res.clearCookie("token");
    await redisClient.del(`user_profile:${userId}`);
    res.status(200).json({
      success: true,
      message: "password updated successfully",
    });
  } catch (error) {
    logger.error(`Error changing password:${error.message}`, {
      userId: req.user.id,
    });
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "invalid link",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({
        success: false,
        message: "invalid or expired token",
      });
    }

    if (decoded.type !== "email-verification") {
      return res.status(400).json({
        success: false,
        message: "invalid token type",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found.",
      });
    }

    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: "user already verified.",
      });
    }

    user.verified = true;
    await user.save();

    // 🔥 CRITICAL: clear ALL related cache
    await redisClient.del(`user_profile:${user._id}`);
    await redisClient.del(`user_token:${user._id}`);

    return res.status(200).json({
      success: true,
      message: "email verified successfully.",
    });
  } catch (error) {
    logger.error(`Verifying email failed: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "internal server error.",
    });
  }
};
