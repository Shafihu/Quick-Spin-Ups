const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  handleImageProcessing,
  compareSheets,
  gradeSheet,
} = require("../controllers");
const { diskUpload, memoryUpload } = require("../helpers/index.js");

router.post(
  "/process-image",
  diskUpload.single("image"),
  handleImageProcessing
);
router.post(
  "/compare-sheets",
  memoryUpload.fields([
    { name: "correctSheet", maxCount: 1 },
    { name: "studentSheet", maxCount: 1 },
  ]),
  compareSheets
);

const upload = multer({ dest: "uploads/" });

router.post("/grade", upload.single("sheet"), gradeSheet);

module.exports = router;
