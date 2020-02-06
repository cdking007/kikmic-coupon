const express = require("express");
const Admin = require("../../models/admin");
const Coupon = require("../../models/coupon");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated } = require("../../security/auth");

router.get("/add-coupon", ensureAuthenticated, (req, res) => {
  res.render("admin/add-coupon", {
    postTitle: "add Coupon",
    description: "Coupon add",
    author: "chirag pipaliya",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png"
  });
});

router.post("/add-coupon", ensureAuthenticated, async (req, res) => {
  const title = req.body.title;
  const urlTitle = title.replace(/ /g, "-");
  const imgUrl = req.body.imgUrl;
  const description = req.body.description;
  const body = req.body.body;
  // console.log(body);
  // console.log(req.body);
  const enrollUrl = req.body.enrollUrl;
  try {
    const coupon = new Coupon({
      title,
      urlTitle,
      imgUrl,
      description,
      body,
      enrollUrl,
      owner: "5e3afaa201933a0814412249"
    });
    await coupon.save();
    res.redirect("/admin/coupons");
  } catch (e) {
    console.log(e);
  }
});

router.get("/coupons", ensureAuthenticated, async (req, res) => {
  const coupons = await Coupon.find({});
  res.render("admin/coupon", {
    postTitle: "Free Coupon codes",
    coupons: coupons,
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png"
  });
});

router.get("/:title", ensureAuthenticated, async (req, res) => {
  if (req.query.edit) {
    const coupon = await Coupon.findOne({ urlTitle: req.params.title });
    if (!coupon) {
      return res.status(404).send("<h1>404 page not found dud</h1>");
    }
    res.render("admin/edit-coupon", {
      postTitle: "Edit Coupon",
      coupon,
      author: "chirag pipaliya",
      description: "Edit coupon" + coupon.title,
      thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png"
    });
  }
});

router.post("/edit-coupon", ensureAuthenticated, async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndUpdate(
      { urlTitle: req.body.urlTitle },
      { ...req.body }
    );
    await coupon.save();
    res.redirect("/admin/coupons");
  } catch (error) {
    console.log("error");
  }
});

router.post("/delete-coupon", ensureAuthenticated, async (req, res) => {
  try {
    await Coupon.findByIdAndRemove(new mongoose.Types.ObjectId(req.body._id));
    res.redirect("/admin/coupons");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
