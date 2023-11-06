const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controller/messageControllers");
const { isAuthenticatedUser } = require("../middleware/auth");

const router = express.Router();

router.route("/:chatId").get(isAuthenticatedUser, allMessages);
router.route("/send").post(isAuthenticatedUser, sendMessage);

module.exports = router;
