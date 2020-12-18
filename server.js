const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Auth & User Accounts",
      description: "Service handles Authentification & Storing of Users",
      servers: ["http://localhost:4000"],
    },
  },
  apis: ["./routes/*.js"],
};

require("dotenv").config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
mongoose
  .connect(
    "mongodb+srv://Tomaz:UO4wOlICjMROU06M@cluster0.s2wi7.mongodb.net/sua?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Mongo DB | Connected"))
  .catch((error) => console.log(error));

// Routes
app.get("/test", (req, res) => {
  res.send("321 db");
});

app.use("/api/user", require("./routes/user_api"));
app.use("/api/auth", require("./routes/auth_api"));

app.listen(4000);
