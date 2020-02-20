const express = require("express");
const router = express.Router();
const Coupon = require("../../models/coupon");
const limit = 1;

router.get("/", async (req, res) => {
  const coupons = await Coupon.find({})
    .sort({ createdAt: -1 })
    .limit(limit);

  res.render("home", {
    postTitle: "Free Coupon codes",
    coupons: coupons,
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: req.user ? true : false,
    isAdmin2: (function() {
      if (req.user) {
        if (req.user.role === "admin") {
          return true;
        }
        return false;
      }
      return false;
    })()
  });
});

router.get("/page/:page", async (req, res, next) => {
  let skipVal = parseInt(req.params.page);
  if (isNaN(skipVal)) {
    return res.status(404).redirect("/404");
  }
  let sVal = skipVal * limit;
  const coupons = await Coupon.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(sVal);
  res.render("home", {
    postTitle: "Free Coupon codes",
    coupons: coupons,
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: req.user ? true : false,
    isAdmin2: (function() {
      if (req.user) {
        if (req.user.role === "admin") {
          return true;
        }
        return false;
      }
      return false;
    })()
  });
});

router.get("/coupon/:title", async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ urlTitle: req.params.title });
    console.log(req.connection.remoteAddress);
    // console.log(coupon);
    if (!coupon) {
      return res.redirect("/");
    }
    res.render("post", {
      ip: req.connection.remoteAddress,
      postTitle: coupon.title + " Free Coupon",
      coupon,
      description: coupon.description,
      author: "chirag pipaliya",
      thumbUrl: coupon.imgUrl,
      isLogin: req.user ? true : false,
      isAdmin2: (function() {
        if (req.user) {
          if (req.user.role === "admin") {
            return true;
          }
          return false;
        }
        return false;
      })()
    });
  } catch (error) {
    console.log("something is want wrong!");
  }
});

module.exports = router;
