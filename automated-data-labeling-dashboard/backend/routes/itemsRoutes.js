const express = require("express");
const DataItem = require("../models/DataItem");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const items = await DataItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

module.exports = router;
