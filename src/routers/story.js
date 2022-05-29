const express = require("express");
const Story = require("../hacker-news/models/story");

const router = express.Router();

router.get("/stories", async (req, res) => {
  try {
    const { top = 30, startTime, endTime } = req.query;
    console.log("GET /stories & query: ", req.query);

    const start = parseInt(startTime);
    const end = parseInt(endTime);
    if (Number.isNaN(startTime) || Number.isNaN(endTime)) {
      return res.status(400).send();
    }

    const stories = await Story.find({
      time: { $gte: start, $lte: end },
    }).sort({ score: -1 });

    if (!stories?.length) {
      return res.status(400).send();
    }

    const topStories = stories.slice(0, top);
    res.send(topStories);
  } catch (error) {
    console.log({ error });
    res.status(500).send(error);
  }
});

module.exports = router;
