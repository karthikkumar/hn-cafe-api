require("./db/mongoose"); // connects to mongoDB
const hnAggregator = require("./hacker-news/aggregator");

const start = () => {
  hnAggregator.run();
};

module.exports = { start };
