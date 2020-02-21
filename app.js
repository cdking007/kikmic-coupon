//initializing the npm modules
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const templatePath = path.join(__dirname, "templates");
const passport = require("passport");
const SitemapGenerator = require("sitemap-generator");

// db connection

require("./db/connection");
//pass
require("./security/passport-config")(passport);

// routes configs
const mains = require("./routes/coupon/home");
const admin = require("./routes/admin/add-coupon");
const login = require("./routes/admin/login");

const app = express();

//settings for the view engine
app.set("view engine", "ejs");
app.set("views", templatePath);

app.use(bodyParser.urlencoded({ extended: false }));
//security and session related settings
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SEC,
    resave: true,
    saveUninitialized: true
  })
);

//passport js authos
app.use(passport.initialize());
app.use(passport.session());

// setting up routes
app.use(mains);
app.use("/admin", admin);
app.use(login);

// loading static files
app.use(express.static(path.join(__dirname, "public")));
var generator = SitemapGenerator("http://localhost:3000", {
  maxDepth: 0,
  filepath: "./public/sitemap.xml",
  maxEntriesPerFile: 50000,
  stripQuerystring: true
});
generator.on("done", () => {
  // sitemaps created
});
generator.start();

//404 page
app.use("/", (req, res) => {
  res.status(404).send("<h1>Page not found </h1>");
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log("listening on the port " + port);
});
