const express = require("express");
const Admin = require("../../models/admin");
const Coupon = require("../../models/coupon");
const router = express.Router();
router.get("/add-user", async (req, res) => {
  try {
    const admin = await new Admin({
      email: "chirag@kikmic.email",
      username: "chirag",
      password: "chirag@007#"
    });
    await admin.save();
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

router.get("/add-coupon", (req, res) => {
  res.render("admin/add-coupon", {
    postTitle: "add Coupon",
    description: "Coupon add",
    author: "chirag pipaliya",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png"
  });
});

router.post("/add-coupon", async (req, res) => {
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
    res.redirect("/");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
