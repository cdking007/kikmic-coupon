//initializing the npm modules
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const templatePath = path.join(__dirname, "templates");

// db connection

require("./db/connection");

// routes configs
const mains = require("./routes/coupon/home");
const admin = require("./routes/admin/add-coupon");

const app = express();
//settings for the view engine
app.set("view engine", "ejs");
app.set("views", templatePath);

app.use(bodyParser.urlencoded({ extended: false }));
// setting up routes

app.use(mains);
app.use("/admin", admin);

// loading static files
app.use(express.static(path.join(__dirname, "public")));

//404 page
app.use("/", (req, res) => {
  res.status(404).send("<h1>Page not found </h1>");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("listening on the port " + port);
});
