const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/items", require("./routes/itemsRoutes"));

module.exports = app;


