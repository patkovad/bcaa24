const express = require("express");
const app = express();
const port = 8000;

const taskController = require("./controller/task");
const statusController = require("./controller/status");

app.use(express.json()); // podpora pro application/json
app.use(express.urlencoded({ extended: true })); // podpora pro application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/task", taskController);
app.use("/status", statusController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});