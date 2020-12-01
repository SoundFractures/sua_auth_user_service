const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.db, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Mongo DB | Connected"))
  .catch((error) => console.log(error));

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("321 db");
});

app.use("/api/user", require("./routes/user_api"));
app.use("/api/auth", require("./routes/auth_api"));

app.listen(port);
