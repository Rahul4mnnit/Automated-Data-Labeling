const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/items", require("./routes/itemsRoutes"));
app.use("/api/stats", require("./routes/statsRoutes"));


module.exports = app;


