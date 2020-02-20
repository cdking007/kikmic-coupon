const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("connected");
  })
  .catch(e => {
    console.log("error");
  });
