const express = require("express");
const Story = require("../hacker-news/models/story");

const router = express.Router();

router.get("/stories", async (req, res) => {
  try {
    const { top = 5, startTime, endTime } = req.query;

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
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
