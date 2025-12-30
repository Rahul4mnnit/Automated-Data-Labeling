const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const DataItem = require("../models/DataItem");
const router = express.Router();
const stream = require("stream");

const autoLabel = require("../services/openaiService");

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
        try {
          const docs = [];

          for (const row of results) {
            const text = row.text || JSON.stringify(row);
            const label = await autoLabel(text);

            docs.push({
              rawData: row,
              aiLabel: label,
              status: "pending",
            });
          }

          await DataItem.insertMany(docs);

          return res.json({
            message: "CSV parsed, auto-labeled & saved successfully",
            count: docs.length,
          });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ error: "CSV auto-labeling failed" });
        }
      });

    return;
  }

  // ================= JSON =================
  if (fileName.endsWith(".json")) {
    try {
      const jsonData = JSON.parse(buffer.toString());
      const records = Array.isArray(jsonData) ? jsonData : [jsonData];

      const docs = [];

      for (const item of records) {
        const text = item.text || JSON.stringify(item);
        const label = await autoLabel(text);

        docs.push({
          rawData: item,
          aiLabel: label,
          status: "pending",
        });
      }

      await DataItem.insertMany(docs);

      return res.json({
        message: "JSON parsed, auto-labeled & saved successfully",
        count: docs.length,
      });
    } catch (err) {
  console.error(err.response?.data || err.message);
  
}

  }

  // ================= INVALID =================
  return res
    .status(400)
    .json({ error: "Only CSV or JSON files are allowed" });
});

module.exports = router;
