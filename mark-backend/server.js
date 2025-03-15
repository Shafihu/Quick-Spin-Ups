const express = require("express");
const omrRoutes = require("./routes/index");
const multer = require("multer");
const cors = require("cors");
const tesseract = require("tesseract.js");

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", omrRoutes);

const upload = multer({ dest: "uploads/" });

const correctAnswers = ["A", "B", "C", "A", "D"];

app.post("/grade", upload.single("sheet"), async (req, res) => {
  try {
    const { path } = req.file;

    //Tesseract.js to extract text from the image
    const {
      data: { text },
    } = await tesseract.recognize(path, "eng");
    const studentAnswers = extractAnswers(text); // Extract answers from OCR text

    // Compare student answers with correct answers
    const score = calculateScore(studentAnswers, correctAnswers);

    // Send the results back to the frontend
    res.json({ success: true, score, studentAnswers, correctAnswers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper function to extract answers from OCR text
function extractAnswers(text) {
  // Example: Extract A, B, C, D from the text (customize based on your sheet format)
  const regex = /[A-D]/g;
  return text.match(regex) || [];
}

// Helper function to calculate the score
function calculateScore(studentAnswers, correctAnswers) {
  let score = 0;
  studentAnswers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) score++;
  });
  return score;
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

console.log("OMR Scanner server is ready to process images.");
