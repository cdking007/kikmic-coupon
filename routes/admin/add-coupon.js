const express = require("express");
const Admin = require("../../models/admin");
const Coupon = require("../../models/coupon");
const mongoose = require("mongoose");
const router = express.Router();
const { ensureAuthenticated, isAdmin } = require("../../security/auth");

router.get("/add-coupon", ensureAuthenticated, isAdmin, (req, res) => {
  res.render("admin/add-coupon", {
    postTitle: "add Coupon",
    description: "Coupon add",
    author: "chirag pipaliya",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: true
  });
});

router.post("/add-coupon", ensureAuthenticated, isAdmin, async (req, res) => {
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
      owner: req.user._id
    });
    await coupon.save();
    res.redirect("/admin/coupons");
  } catch (e) {
    console.log(e);
  }
});

router.get("/coupons", ensureAuthenticated, isAdmin, async (req, res) => {
  const coupons = await Coupon.find({});
  res.render("admin/coupon", {
    postTitle: "Free Coupon codes",
    coupons: coupons,
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: true
  });
});

router.get("/members", ensureAuthenticated, isAdmin, async (req, res) => {
  const members = await Admin.find({});
  res.render("admin/members", {
    postTitle: "Members",
    members: members,
    author: "chirag pipaliya",
    description: "Site Members",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: true
  });
});

router.get("/:title", ensureAuthenticated, isAdmin, async (req, res) => {
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
      thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
      isLogin: true
    });
  }
});

router.post("/edit-coupon", ensureAuthenticated, isAdmin, async (req, res) => {
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

router.post(
  "/delete-coupon",
  ensureAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      await Coupon.findByIdAndRemove(new mongoose.Types.ObjectId(req.body._id));
      res.redirect("/admin/coupons");
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
