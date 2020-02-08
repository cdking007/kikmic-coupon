const express = require("express");
const router = express.Router();
const Coupon = require("../../models/coupon");
const passport = require("passport");
const Admin = require("../../models/admin");
const initializePassport = require("../../security/passport-config");
const pwChecker = require("../../models/password");
const {
  ensureNotAuthenticated,
  ensureAuthenticated
} = require("../../security/auth");

router.get("/login", ensureNotAuthenticated, (req, res, next) => {
  res.render("login", {
    postTitle: "Login",
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: false
  });
});
router.post("/login", ensureNotAuthenticated, (req, res, next) => {
  req.body.username = req.body.username.toLowerCase().trim();
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/signup", ensureNotAuthenticated, async (req, res) => {
  res.render("signup", {
    postTitle: "signup",
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: false
  });
});

router.post("/signup", ensureNotAuthenticated, async (req, res) => {
  const email = req.body.email;
  const username = req.body.username.toLowerCase().trim();
  const password = req.body.password;
  const checkUsername = await Admin.findOne({ username });
  const checkEmail = await Admin.findOne({ email });

  let splChars = "*|,\":<>[]{}`';()@&$#% ";
  for (let i = 0; i < req.body.username.length; i++) {
    if (splChars.indexOf(req.body.username.charAt(i)) != -1) {
      req.flash("error", "Username can not contain special characters!");
      return res.redirect("/signup");
    }
  }
  if (checkUsername) {
    req.flash("error", "User already exist with this username");
    return res.redirect("/signup");
  }
  if (checkEmail) {
    req.flash("error", "User already exist with this Email");
    return res.redirect("/signup");
  }
  if (!pwChecker.validate(password)) {
    const errors = pwChecker.validate(password, { list: true });

    let errorStr = errors.join(" ,");
    errorStr = errorStr.replace("min", "min length 8");
    errorStr = errorStr.replace("max", "max length 50");
    req.flash("error", "Password must contain", errorStr);
    return res.redirect("/signup");
  }
  const admin = new Admin({ email, username, password });
  await admin
    .save()
    .then(() => {
      res.redirect("/login");
    })
    .catch(e => console.log(e));
});
router.get("/logout", ensureAuthenticated, (req, res) => {
  res.render("logout", {
    postTitle: "logout",
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: true
  });
});
router.post("/logout", ensureAuthenticated, (req, res) => {
  req.logout();
  setTimeout(() => {
    res.redirect("/");
  }, 500);
});

module.exports = router;
