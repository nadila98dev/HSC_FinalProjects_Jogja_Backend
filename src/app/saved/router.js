const express = require("express");
const router = express.Router();

const {
  saveItemAsFavorite,
  getSavedItemsByUserId,
  deleteSavedItem,
} = require("./controller");
const { authenticateUser } = require("../../middlewares/auth");

router.post("/", authenticateUser, saveItemAsFavorite);
router.get("/", authenticateUser, getSavedItemsByUserId);
router.delete("/", authenticateUser, deleteSavedItem);

module.exports = router;
