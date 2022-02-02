const mongoose = require("mongoose");

const connect = (callback) => {
  mongoose.connect(process.env.MONGO_DB_URL, () => {
    console.log("Connected to mongoDB!");
    callback();
  });
};

module.exports = { connect };
