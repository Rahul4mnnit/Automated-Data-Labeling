const mongoose = require("mongoose");

const DataItemSchema = new mongoose.Schema({
  rawData: Object,
  aiLabel: String,
  finalLabel: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "overridden"],
    default: "pending",
  },
});

module.exports = mongoose.model("DataItem", DataItemSchema);
