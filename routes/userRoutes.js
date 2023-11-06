const express = require("express");
const router = express.Router();

const { isAuthenticatedUser } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  getUserDetails,
  logout,
  allUser,
  forgotPassword,
  updateUser,
  deleteUser,
  searchUsers
} = require("../controller/userController");

//userRoutes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(isAuthenticatedUser, logout);
router.route("/forgot").post(isAuthenticatedUser, forgotPassword);
router.route("/me/:id").get(isAuthenticatedUser, getUserDetails);
router.route("/all/users").get(isAuthenticatedUser, allUser);
router.route("/search").get(isAuthenticatedUser, searchUsers);
router.route("/update/user/:id").put(isAuthenticatedUser, updateUser);
router.route("/delete/user/:id").delete(isAuthenticatedUser, deleteUser);

module.exports = router;
