const express = require("express");
const Admin = require("../../models/admin");
const Coupon = require("../../models/coupon");
const mongoose = require("mongoose");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const reqCoupon = require("../../models/req-coupon");
const { ensureAuthenticated, isAdmin } = require("../../security/auth");

router.get("/", ensureAuthenticated, isAdmin, async (req, res) => {
  const totMember = await Admin.find({}).count();
  const totCoupon = await Coupon.find({}).count();

  res.render("admin/dashboard", {
    totMember,
    totCoupon,
    path: "/dashboard"
  });
});

router.get("/add-coupon", ensureAuthenticated, isAdmin, (req, res) => {
  res.render("admin/add-coupon", {
    postTitle: "add Coupon",
    description: "Coupon add",
    author: "chirag pipaliya",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: true,
    path: "/coupons"
  });
});

router.post("/add-coupon", ensureAuthenticated, isAdmin, async (req, res) => {
  const title = req.body.title;
  const urlTitle = title.replace(/ /g, "-");
  const imgUrl = req.body.imgUrl;
  const description = req.body.description;
  const body = req.body.body;
  const keywords = req.body.keywords;
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
      keywords,
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
    isLogin: true,
    path: "/coupons"
  });
});

router.get("/request", ensureAuthenticated, isAdmin, async (req, res) => {
  const cpRequest = await reqCoupon.find({});
  res.render("admin/request", {
    postTitle: "coupons request",
    cpRequest,
    author: "chirag pipaliya",
    description: "Site Members",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: true,
    path: "/request",
    id: req.user._id
  });
});

router.post(
  "/request/delete",
  ensureAuthenticated,
  isAdmin,
  async (req, res) => {
    const id = req.body.id;
    await reqCoupon.findByIdAndRemove(id);

    res.redirect("/admin/request");
  }
);

router.get("/members", ensureAuthenticated, isAdmin, async (req, res) => {
  const members = await Admin.find({});
  res.render("admin/members", {
    postTitle: "Members",
    members: members,
    author: "chirag pipaliya",
    description: "Site Members",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: true,
    path: "/members",
    id: req.user._id
  });
});

router.post(
  "/member/delete",
  ensureAuthenticated,
  isAdmin,
  async (req, res) => {
    const id = req.body.id;
    console.log(id);
    await Admin.findByIdAndDelete(id);

    req.flash("info", "user deleted");
    res.redirect("/admin/members");
  }
);

router.post(
  "/member/update",
  ensureAuthenticated,
  isAdmin,
  async (req, res) => {
    const email = req.body.email;
    const role = req.body.role;
    // console.log(role);
    req.flash("info", "User updated");
    try {
      const member = await Admin.findByIdAndUpdate(req.body.id, {
        email: email,
        role: role.toLowerCase()
      });
      await member.save();
      req.flash("info", "user updated");
      res.redirect("/admin/members");
    } catch (e) {
      console.log(e);
    }
  }
);
router.post(
  "/member/changepass",
  ensureAuthenticated,
  isAdmin,
  async (req, res) => {
    const id = req.body.id;
    const password = await bcryptjs.hash(req.body.password, 8);
    try {
      const member = await Admin.findByIdAndUpdate(id, {
        password
      });
      await member.save();
      req.flash("info", "user password changed");
      res.redirect("/admin/members");
    } catch (e) {
      console.log(e);
    }
  }
);

router.get("/member/:id", ensureAuthenticated, isAdmin, async (req, res) => {
  const id = req.params.id;
  const member = await Admin.findById(id);
  if (member) {
    res.render("admin/edit-member", {
      postTitle: "Members",
      member,
      author: "chirag pipaliya",
      description: "Site Members",
      thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
      isLogin: true,
      path: "/members",
      id: req.user._id
    });
  } else {
    res.send("404 not found sir!");
  }
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
      isLogin: true,
      path: "/coupons"
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
    req.flash("info", "coupon updated");
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
      req.flash("info", "coupon deleted");
      res.redirect("/admin/coupons");
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
