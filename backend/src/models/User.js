const mongoose = require("mongoose");
const validator = require("validator");
const jwt=require("jsonwebtoken");
const bcrypt= require("bcrypt");


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: function () {
        return this.role === "student";
      },
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    regNumber: {
      type: String,
      unique: true,
      required: function () {
        return this.role === "student";
      },
      trim: true,
    },
    department: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      trim: true,
    },
    year: {
      type: Number,
      min: 1,
      max: 4,
      required: function () {
        return this.role === "student";
      },
    },
  },
  {
    timestamps: true,
  }
);


userSchema.methods.getJWT = function () {
  const token = jwt.sign(
    { _id: this._id,_role:this._role},
    process.env.JWT_SECRET,
    {
      expiresIn: "6d",
    }
  );
  return token;
};


userSchema.methods.validatePassword= async function(passwordInputByUser) {
    const user = this;
    const passwordHash = this.password;

    const isPasswordValid= await bcrypt.compare(
        passwordInputByUser,
        passwordHash);

        return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
