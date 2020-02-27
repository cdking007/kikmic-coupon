const express = require("express");
const router = express.Router();
const Coupon = require("../../models/coupon");
const limit = 16;
const requestIp = require("request-ip");
const reqCoupon = require("../../models/req-coupon");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const request = require("request");

router.get("/", async (req, res) => {
  const coupons = await Coupon.find({})
    .sort({ createdAt: -1 })
    .limit(limit);
  const popular = await Coupon.find({})
    .sort({ views: -1 })
    .limit(4);

  res.render("home", {
    postTitle: "Free Coupon codes",
    coupons: coupons,
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: req.user ? true : false,
    popular: popular,
    keywords:
      "couponshub,kikmic,free coupons,free udemy courses,free offer,coupons adda,free offers,free courses",
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

router.post("/api/reqcoupon", async (req, res) => {
  const reqcp = new reqCoupon({ ...req.body });
  try {
    await reqcp.save();
    res.status(200).send(reqcp);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/sec/api/whatsapp/sms", async (req, res) => {
  const twiml = new MessagingResponse();

  let msg = req.body.Body;
  let number = req.body.From;
  let rs1 = msg.startsWith("#request");
  if (rs1) {
    msg = msg.replace("#request ", "");
    const rs2 = msg.startsWith("https://udemy.com/");

    if (rs2) {
      await request.post(
        "http://couponshub.website/api/reqcoupon",
        { json: { url: msg, number: number } },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            twiml.message(
              "Hello! \n " +
                number +
                "\n Your request to url: " +
                rs2 +
                "Is in progress!\n you will get notified when its found in our db its take few time!"
            );
          }
        }
      );

      twiml.message(
        "Hello! \n " +
          number +
          "\n Your request to url: " +
          msg +
          "Is Submitted!"
      );
    } else {
      twiml.message(
        "Hello! \n " +
          number +
          "\n Your requested must  be from https://udemy.com"
      );
    }
  } else {
    twiml.message(
      "Hello! \n " + number + "\n Your request must start with #request prefix"
    );
  }

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

router.get("/api/reqcoupon", async (req, res) => {
  const coupons = await reqCoupon.find({});
  res.send(coupons);
});

router.get("/privacy", (req, res) => {
  res.render("privacy", {
    postTitle: "Privacy policy",
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    keywords: "privacy policy of kikmic",
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
router.get("/terms", (req, res) => {
  res.render("terms", {
    postTitle: "Terms and condition",
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: req.user ? true : false,
    keywords: "terms and conditions of kikmic",
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
router.get("/contact", (req, res) => {
  res.render("contact", {
    postTitle: "Contact us",
    author: "chirag pipaliya",
    description: "One stop for all Free coupon course",
    thumbUrl: "https://kikmic.ca/wp-content/uploads/2019/04/cropped-mini.png",
    isLogin: req.user ? true : false,
    keywords: "contact us",
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
    keywords: skipVal + " page",
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
    // console.log(req.connection.remoteAddress);
    // console.log(coupon);
    if (!coupon) {
      return res.redirect("/");
    }
    let views = coupon.views;
    let viewsInc = views + 1;
    const cpn = await Coupon.findOneAndUpdate(
      { urlTitle: req.params.title },
      { views: viewsInc }
    );
    await cpn.save();
    const coupons = await Coupon.find({})
      .sort({ createdAt: -1 })
      .limit(4);
    res.render("post", {
      views,
      postTitle: coupon.title + " Free Coupon",
      coupon,
      popular: coupons,
      description: coupon.description,
      author: "chirag pipaliya",
      thumbUrl: coupon.imgUrl,
      isLogin: req.user ? true : false,
      keywords: coupon.keywords,
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
