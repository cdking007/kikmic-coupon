const mongoose = require("mongoose");

const reqCouponSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const reqCoupon = mongoose.model("reqCoupon", reqCouponSchema);

module.exports = reqCoupon;
