const express = require("express");
const router = express.Router();
const Coupon = require("../../models/coupon");
const passport = require("passport");
const Admin = require("../../models/admin");
const initializePassport = require("../../security/passport-config");
const { ensureNotAuthenticated } = require("../../security/auth");

router.get("/login", ensureNotAuthenticated, (req, res, next) => {
  res.render("login", {
    postTitle: "Login",
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png"
  });
});
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin/coupons",
    failureRedirect: "/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/signup", ensureNotAuthenticated, (req, res) => {
  res.render("signup", {
    postTitle: "signup",
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png"
  });
});

router.post("/signup", async (req, res) => {
  const { email, username, password } = { ...req.body };
  const admin = new Admin({ email, username, password });
  await admin
    .save()
    .then(() => {
      res.redirect("/login");
    })
    .catch(e => console.log(e));
});

module.exports = router;
