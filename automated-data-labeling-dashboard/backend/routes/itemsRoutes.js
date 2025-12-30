const express = require("express");
const DataItem = require("../models/DataItem");
const router = express.Router();

// GET all items
router.get("/", async (req, res) => {
  const items = await DataItem.find().sort({ createdAt: -1 });
  res.json(items);
});

// ACCEPT label
router.post("/:id/accept", async (req, res) => {
  const item = await DataItem.findById(req.params.id);

  item.finalLabel = item.aiLabel || item.rawData.label;
  item.status = "accepted";

  await item.save();
  res.json({ message: "Label accepted" });
});

// OVERRIDE label
router.post("/:id/override", async (req, res) => {
  const { label } = req.body;

  const item = await DataItem.findByIdAndUpdate(
    req.params.id,
    {
      finalLabel: label,
      status: "overridden",
    },
    { new: true }
  );

  res.json({ message: "Label overridden", item });
});

module.exports = router;
