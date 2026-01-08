const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { validateRegistrationData } = require("../utils/validation");

authRouter.post("/register", async (req, res) => {
  try {
    validateRegistrationData(req);

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      regNumber,
      department,
      year,
    } = req.body;

    const existingStudent = await User.findOne({
      $or: [{ regNumber }, { email }],
    });
    if (existingStudent) {
      return res
        .status(400)
        .json({
          message:
            "Student with this email or registration number already exists",
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      role: "student",
      regNumber,
      department,
      year,
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: savedUser._id,
        firstName: savedUser.firstName,
        email: savedUser.email,
        role: savedUser.role,
        regNumber: savedUser.regNumber,
        department: savedUser.department,
        year: savedUser.year,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      //add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    if (error.message === "Invalid Credentials") {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

authRouter.post("/logout", (req,res)=> {
  try {
    res.cookie("token", "", {
      httpOnly:true,
      expies: new Date(0),

    });

    return res.status(200).json({
      message:"Logout successful",
    });
  } catch(error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message:"Server error during logout",
    });
    
  }
});

module.exports = authRouter;
