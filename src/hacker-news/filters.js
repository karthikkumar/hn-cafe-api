const { ItemType } = require("./constants");

const justStories = (items) => {
  if (items?.length) {
    // filter stories
    const allStories = items.filter((item) => item.type === ItemType.story);
    // filter dead stories
    const aliveStories = allStories.filter((story) => !story.dead);
    // filter Show HN and Ask HN
    const stories = aliveStories.filter(
      (story) =>
        !["Show HN:", "Ask HN:"].some((prefix) => story.title?.includes(prefix))
    );
    return stories;
  }
};

module.exports = {
  justStories,
};
