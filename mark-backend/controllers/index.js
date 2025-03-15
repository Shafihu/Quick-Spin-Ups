const { createWorker } = require("tesseract.js");
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const tesseract = require("tesseract.js");
const resemble = require("resemblejs");
const { detectShadedAnswers } = require("../helpers/index.js");

const TEMP_DIR = path.join(__dirname, "..", "temp");
const CLEANUP_INTERVAL = 1000 * 60 * 60; 

// Making sure temp directory exists
fs.mkdir(TEMP_DIR, { recursive: true }).catch(console.error);

const preprocessImage = async (imagePath) => {
  return sharp(imagePath)
    .resize(1500)
    .greyscale()
    .threshold(128)
    .normalize()
    .sharpen()
    .toBuffer();
};

const handleImageProcessing = async (req, res) => {
  const correctAnswers = ["B", "B", "C", "A", "D"];

  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded." });
  }

  const imagePath = req.file.path;

  try {
    // Preprocess the image
    const processedImage = await preprocessImage(imagePath);
    console.log("Image preprocessing completed.");

    // Perform OCR
    const worker = await createWorker("eng");
    await worker.setParameters({
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.",
      tessedit_pageseg_mode: "6",
    });

    console.log("Starting OCR...");
    const {
      data: { text: ocrResult },
    } = await worker.recognize(processedImage);
    await worker.terminate();

    console.log("OCR completed:", ocrResult);

    // Detect shaded answers
    const detectedAnswers = detectShadedAnswers(ocrResult);

    // Compare detected answers with correct answers
    const comparisonResults = correctAnswers.map((correct, index) => ({
      question: index + 1,
      detected: detectedAnswers[index] || "Not detected",
      correct: detectedAnswers[index] === correct,
    }));

    // Calculate score
    const score = comparisonResults.filter((result) => result.correct).length;

    // Send response
    res.json({
      ocrText: ocrResult,
      results: comparisonResults,
      score: `${score}/${correctAnswers.length}`,
    });

    // Move the file to temp directory instead of deleting
    const tempFilePath = path.join(TEMP_DIR, path.basename(imagePath));
    await fs.rename(imagePath, tempFilePath);
    // console.log(`File moved to temp directory: ${tempFilePath}`);
  } catch (error) {
    console.error("Error processing image:", error);
    res
      .status(500)
      .json({ error: "Error processing image.", details: error.message });

    // Attempt to delete the file even if processing failed
    try {
      await fs.unlink(imagePath);
    } catch (deleteError) {
      console.error(
        "Failed to delete file after processing error:",
        deleteError.message
      );
    }
  }
};

/////////////////////////////////////////////////////////////////////////////////////////

const ANSWER_BOX_SIZE = 50; 
const THRESHOLD = 5; 

const compareSheets = async (req, res) => {
  if (!req.files || !req.files.correctSheet || !req.files.studentSheet) {
    return res.status(400).json({
      error: "Both correct sheet and student sheet must be uploaded.",
    });
  }

  try {
    const preprocessImage = async (imageBuffer) => {
      try {
        const metadata = await sharp(imageBuffer).metadata();
        const { width, height } = metadata;

        const croppedImage = await sharp(imageBuffer)
          .extract({
            left: 0,
            top: Math.floor(height / 2),
            width,
            height: Math.floor(height / 2),
          })
          .rotate()

          .resize(600, 600, {
            fit: "cover", 
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          })
          .toBuffer();

        return croppedImage;
      } catch (error) {
        console.error("Error preprocessing image:", error);
        throw error;
      }
    };

    const correctSheet = await preprocessImage(
      req.files.correctSheet[0].buffer
    );
    const studentSheet = await preprocessImage(
      req.files.studentSheet[0].buffer
    );

    const { differences, diffImage } = await compareImages(
      correctSheet,
      studentSheet
    );

    const totalQuestions = 20; 
    const incorrectAnswers = Math.round(differences * totalQuestions);
    const correctAnswers = totalQuestions - incorrectAnswers;

    const imagePath = `difference_image.png`;
    await fs.writeFile(imagePath, Buffer.from(diffImage));

    res.json({
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      diffImageBase64: diffImage.toString("base64"),
    });
  } catch (error) {
    console.error("Error comparing sheets:", error);
    res
      .status(500)
      .json({ error: "Error comparing sheets.", details: error.message });
  }
};

const compareImages = async (image1Buffer, image2Buffer) => {
  return new Promise((resolve, reject) => {
    resemble(image1Buffer)
      .compareTo(image2Buffer)
      .scaleToSameSize()
      .ignoreColors()
      //   .ignoreAntialiasing()
      .onComplete((data) => {
        if (data.error) {
          reject(data.error);
        } else {
          const diffImageBuffer = Buffer.from(data.getBuffer());
          resolve({
            differences: parseFloat(data.misMatchPercentage),
            diffImage: diffImageBuffer,
          });
        }
      });
  });
};

/////////////////////////////////////////////////////////////////////////////////////////

const cleanupTempFiles = async () => {
  try {
    const files = await fs.readdir(TEMP_DIR);
    const currentTime = Date.now();

    for (const file of files) {
      const filePath = path.join(TEMP_DIR, file);
      const stats = await fs.stat(filePath);

      // Deleting files older than 1 hour
      if (currentTime - stats.mtime.getTime() > CLEANUP_INTERVAL) {
        await fs.unlink(filePath);
        console.log(`Deleted old file: ${filePath}`);
      }
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};
// Running cleanup every hour
setInterval(cleanupTempFiles, CLEANUP_INTERVAL);

//DEEPSEEK METHOD
const gradeSheet = async (req, res) => {
  const correctAnswers = ["A", "B", "C", "D", "A"];
  try {
    const { path } = req.file;

    // Preprocess the image (grayscale, contrast, noise reduction)
    async function preprocessImage(imagePath) {
      const processedImagePath = "uploads/processed.jpg";

      await sharp(imagePath)
        .greyscale() // Convert to grayscale
        .normalise() // Normalize brightness and contrast
        .toFile(processedImagePath);

      return processedImagePath;
    }

    function extractAnswers(text) {
      const regex = /[A-D]/g;
      return text.match(regex) || [];
    }

    function calculateScore(studentAnswers, correctAnswers) {
      let score = 0;
      studentAnswers.forEach((answer, index) => {
        if (answer === correctAnswers[index]) score++;
      });
      return score;
    }

    const processedImagePath = await preprocessImage(path);

    // Use Tesseract.js to extract text from the preprocessed image
    const {
      data: { text },
    } = await tesseract.recognize(processedImagePath, "eng");
    const studentAnswers = extractAnswers(text);

    // Compare student answers with correct answers
    const score = calculateScore(studentAnswers, correctAnswers);

    res.json({ success: true, score, studentAnswers, correctAnswers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { handleImageProcessing, compareSheets, gradeSheet };
