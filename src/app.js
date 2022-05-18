const express = require("express");
const database = require("./mongodb/mongoose");
const hnAggregator = require("./hacker-news/aggregator");
const storyRouter = require("./routers/story");

const app = express();

app.use(express.json());
app.use("/api", storyRouter);

// connects to MongoDB
database.connect(() => {
  hnAggregator.run();
});

module.exports = app;
