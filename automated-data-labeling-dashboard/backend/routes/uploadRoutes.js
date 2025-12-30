const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const DataItem = require("../models/DataItem");
const router = express.Router();
const stream = require("stream");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileName = req.file.originalname.toLowerCase();
  const buffer = req.file.buffer;

  // ================= CSV =================
  if (fileName.endsWith(".csv")) {
    const results = [];
    const readable = new stream.Readable();
    readable.push(buffer);
    readable.push(null);

    readable
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const docs = results.map((row) => ({
          rawData: row,
          status: "pending",
        }));

        await DataItem.insertMany(docs);

        return res.json({
          message: "CSV parsed & saved successfully",
          count: docs.length,
        });
      });

    return;
  }

  // ================= JSON =================
  if (fileName.endsWith(".json")) {
    try {
      const jsonData = JSON.parse(buffer.toString());

      // ensure array
      const records = Array.isArray(jsonData) ? jsonData : [jsonData];

      const docs = records.map((item) => ({
        rawData: item,
        status: "pending",
      }));

      await DataItem.insertMany(docs);

      return res.json({
        message: "JSON parsed & saved successfully",
        count: docs.length,
      });
    } catch (err) {
      return res.status(400).json({ error: "Invalid JSON file" });
    }
  }

  // ================= INVALID =================
  return res
    .status(400)
    .json({ error: "Only CSV or JSON files are allowed" });
});

module.exports = router;
