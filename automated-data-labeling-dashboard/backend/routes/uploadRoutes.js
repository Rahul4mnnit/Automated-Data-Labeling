const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileName = req.file.originalname;
  const buffer = req.file.buffer;

  // JSON FILE
  if (fileName.endsWith(".json")) {
    const jsonData = JSON.parse(buffer.toString());
    return res.json({
      message: "JSON parsed successfully",
      records: jsonData.length || 1,
    });
  }

  // CSV FILE
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
          message: "CSV parsed successfully",
          records: results.length,
        });
      });

    return;
  }

  res.status(400).json({ error: "Unsupported file format" });
});

module.exports = router;
