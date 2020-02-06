const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("connected");
  })
  .catch(e => {
    console.log("error");
  });
