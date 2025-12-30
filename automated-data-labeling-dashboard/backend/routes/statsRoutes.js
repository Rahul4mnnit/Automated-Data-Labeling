const express = require("express");
const DataItem = require("../models/DataItem");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const total = await DataItem.countDocuments();
    const pending = await DataItem.countDocuments({ status: "pending" });
    const accepted = await DataItem.countDocuments({ status: "accepted" });
    const overridden = await DataItem.countDocuments({ status: "overridden" });

    res.json({
      total,
      pending,
      accepted,
      overridden,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
