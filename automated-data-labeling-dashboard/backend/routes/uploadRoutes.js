const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const router = express.Router();

// store uploaded file in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileName = req.file.originalname;
  const buffer = req.file.buffer;

  // 🔹 JSON FILE
  if (fileName.endsWith(".json")) {
    try {
      const jsonData = JSON.parse(buffer.toString());
      return res.json({
        type: "json",
        records: jsonData,
        count: Array.isArray(jsonData) ? jsonData.length : 1,
      });
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON file" });
    }
  }

  // 🔹 CSV FILE
  if (fileName.endsWith(".csv")) {
    const results = [];
    const stream = require("stream");
    const readable = new stream.Readable();
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        res.json({
          type: "csv",
          records: results,
          count: results.length,
        });
      });

    return;
  }

  // 🔹 Unsupported file
  res.status(400).json({ error: "Only CSV or JSON files are allowed" });
});




module.exports = router;
