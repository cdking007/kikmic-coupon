const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
adminSchema.pre("save", async function(req, res, next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcryptjs.hash(admin.password, 8);
  }
  next();
});
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
