const mongoose = require("mongoose");

const connect = (callback) => {
  console.log({ env: process.env.ENV });
  mongoose.connect(process.env.MONGO_DB_URL, () => {
    console.log("Connected to mongoDB!");
    callback();
  });
};

module.exports = { connect };
