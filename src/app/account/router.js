const express = require("express");
const router = express.Router();
const {
  updateAddress,
  updatePhoneNumber,
  uploadAvatar,
  getAccount,
} = require("./controller");
const { authenticateUser } = require("../../middlewares/auth");
const upload = require("../../middlewares/multer");

router.put("/update-address", authenticateUser, updateAddress);
router.put("/update-phone", authenticateUser, updatePhoneNumber);
router.post(
  "/update-avatar",
  authenticateUser,
  upload.single("avatar"),
  uploadAvatar
);
router.get("/", authenticateUser, getAccount);

module.exports = router;
