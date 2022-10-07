const express = require("express");
const database = require("./mongodb/mongoose");
const hnAggregator = require("./hacker-news/aggregator");
const storyRouter = require("./routers/story");
const cors = require("cors");

const app = express();

const whitelist = ["localhost:3000", "hackernews.cafe"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.some((item) => origin.includes(item))) {
      callback(null, true);
    } else {
      callback(new Error(`Origin: ${origin}, not allowed by CORS`));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api", storyRouter);

// connects to MongoDB
database.connect(() => {
  hnAggregator.run();
});

module.exports = app;
