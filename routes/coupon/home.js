const express = require("express");
const router = express.Router();
const Coupon = require("../../models/coupon");

router.get("/", async (req, res) => {
  const coupons = await Coupon.find({});
  res.render("home", {
    postTitle: "Free Coupon codes",
    coupons: coupons,
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png"
  });
});
router.get("/coupon/:title", async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ urlTitle: req.params.title });
    // console.log(coupon);
    if (!coupon) {
      return res.redirect("/");
    }
    res.render("post", {
      postTitle: coupon.title + " Free Coupon",
      coupon,
      description: coupon.description,
      author: "chirag pipaliya",
      thumbUrl: coupon.imgUrl
    });
  } catch (error) {
    console.log("something is want wrong!");
  }
});
module.exports = router;
