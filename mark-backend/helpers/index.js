const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const resemble = require("resemblejs");

// Helper function to detect shaded answers
const detectShadedAnswers = (ocrText) => {
  const lines = ocrText.split("\n");
  const detectedAnswers = new Array(10).fill(null);

  for (const line of lines) {
    const match = line.match(/(\d+)\s*[.]\s*([A-D])/i);
    if (match) {
      const questionNumber = parseInt(match[1]) - 1;
      if (questionNumber >= 0 && questionNumber < 10) {
        detectedAnswers[questionNumber] = match[2].toUpperCase();
      }
    }
  }

  return detectedAnswers;
};

// Helper function to compare two images

const compareImages = async (image1Buffer, image2Buffer) => {
  try {
    return new Promise((resolve, reject) => {
      resemble(image1Buffer)
        .compareTo(image2Buffer)
        .ignoreNothing()
        .ignoreColors()
        .ignoreAntialiasing()

        .onComplete(function (data) {
          if (data.error) {
            return reject(data.error);
          }

          const diffImageBuffer = Buffer.from(data.getBuffer());
          resolve({
            differences: data.misMatchPercentage,
            diffImage: diffImageBuffer,
          });
        });
    });
  } catch (error) {
    console.error("Error in compareImages:", error);
    throw error;
  }
};

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(
    new Error(
      "Error: File upload only supports the following filetypes - " + filetypes
    )
  );
};

const diskUpload = multer({
  storage: diskStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

const memoryUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = {
  detectShadedAnswers,
  compareImages,
  diskUpload,
  memoryUpload,
};
