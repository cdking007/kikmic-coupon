// const connection = require("../db/connection");
const mongoose = require("mongoose");
const couponSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },
    urlTitle: {
      type: String,
      required: true,
      unique: true
    },
    imgUrl: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    enrollUrl: {
      type: String,
      required: true
    },
    views: {
      type: Number,
      required: true,
      default: 0
    },
    keywords: {
      type: String,
      default: this.title
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    }
  },
  {
    timestamps: true
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
