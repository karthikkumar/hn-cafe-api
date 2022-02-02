const { ItemType } = require("./constants");

const isJustStory = (item) => {
  return (
    item?.type === ItemType.story &&
    !item?.dead &&
    !["Show HN:", "Ask HN:"].some((prefix) => item?.title?.startsWith(prefix))
  );
};

const filterJustStories = (items) => {
  if (items?.length) {
    // filter out stories > dead > deleted > Show HN and Ask HN
    return items.filter(
      (item) =>
        item.type === ItemType.story &&
        !item.dead &&
        !item.deleted &&
        !["Show HN:", "Ask HN:"].some((prefix) => item.title?.includes(prefix))
    );
  }
};

module.exports = {
  isJustStory,
  filterJustStories,
};
