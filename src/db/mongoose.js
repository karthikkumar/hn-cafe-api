const mongoose = require("mongoose");

const connectionURLWithDatabase = process.env.MONGO_DB_URL;

mongoose.connect(connectionURLWithDatabase, () => {
  console.log("Connected to mongoDB!");
});
