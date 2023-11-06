const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controller/chatControllers");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/access").post(isAuthenticatedUser, accessChat);
router.route("/fetch").get(isAuthenticatedUser, fetchChats);
router.route("/group").post(isAuthenticatedUser, createGroupChat);
router.route("/rename").put(isAuthenticatedUser, renameGroup);
router.route("/groupremove").put(isAuthenticatedUser, removeFromGroup);
router.route("/groupadd").put(isAuthenticatedUser, addToGroup);

module.exports = router;
