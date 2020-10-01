const express = require("express");

const app = express();

app.get("/", function (req, res) {
  res.send("API is Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running ${PORT}`));
