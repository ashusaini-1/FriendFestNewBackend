const User = require("../model/userModel");
const { sendToken } = require("../utils/jwtToken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const ApiFeatures = require("../utils/apifeatures");

//Register User
module.exports.registerUser = async (req, res, next) => {
  const { name, dob, gender, email, password } = req.body;
  console.log(email, password, name);

  try {
    if (!name || !email || !gender || !dob || !password) {
      return res.status(401).json({
        success: false,
        message: "Please Enter all the Details",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({
      name,
      dob,
      email,
      gender,
      password,
    });

    console.log(user);
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//Login User

module.exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email and Password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    // Compare the provided password with the stored hash using bcrypt.compare
    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Password matches, send a token
    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

//Forgot Password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and newPassword.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this email",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000;

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

// Get User Detail
exports.getUserDetails = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};


module.exports.searchUsers = async (req, res) => {
  try {
    const searchTerm = req.query.name || ""; // Get the name search term from the query parameters

    if (searchTerm === "") {
      return res.status(400).json({
        success: false,
        message: "A search term is required.",
      });
    }

    const initialQuery = User.find({
      name: { $regex: searchTerm, $options: "i" },
    });

    // Get the total count of users matching the search term
    const userCount = await User.countDocuments({
      name: { $regex: searchTerm, $options: "i" },
    });

    if (userCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const apiFeature = new ApiFeatures(initialQuery, req.query).filter();

    const users = await apiFeature.query;

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

//get All User Details
module.exports.allUser = async (req, res) => {
  try {
    const allUser = await User.find({}, "name email");

    res.status(200).json({
      success: true,
      allUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

//delete User
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

//update User
exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    const user = await User.findByIdAndUpdate(userId, userData, { new: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
