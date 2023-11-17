const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Math.floor(Math.random() * 999999999) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    // reject file
    cb(
      {
        message: "Format file not supported",
      },
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 2000000,
  },
  fileFilter: fileFilter,
});

module.exports = upload;
