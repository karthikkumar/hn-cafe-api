const axios = require("axios");
const { ref, onValue, get } = require("firebase/database");
const firebaseDB = require("./firebase/database");
const { numbersInRange } = require("../utils/numbers");
const { filterJustStories } = require("./filters");
const Setting = require("./models/setting");
const Story = require("./models/story");

const getItemIdsToProcess = async (itemId) => {
  const latestItemId = parseInt(itemId);
  if (Number.isNaN(latestItemId)) return [];

  // DB Request: get it from setting or set any min item's id (-1000)
  const setting = await Setting.findOne({
    name: "lastProcessedItemId",
  });
  console.log({ setting });
  const lastProcessedItemId = setting?.value ?? latestItemId - 1000;

  return numbersInRange(lastProcessedItemId, latestItemId);
};

let isFetchingNewStories = false;

const fetchNewStories = async (maxItemId) => {
  isFetchingNewStories = true;
  try {
    const itemIdsToProcess = await getItemIdsToProcess(maxItemId);
    console.log({ itemIdsToProcess });
    // HN Request: get item by id
    const itemPromies = itemIdsToProcess.map((itemId) =>
      get(ref(firebaseDB, `v0/item/${itemId}`))
    );
    const itemSnapshots = await Promise.all(itemPromies);
    const newStories = itemSnapshots.map((snapshot) =>
      snapshot.exists() ? snapshot.val() : {}
    );
    const justStories = filterJustStories(newStories);

    console.log({ justStories, count: justStories.length });

    if (justStories.length) {
      const saveStoryPromises = justStories.map((item) => {
        const story = new Story({ ...item });
        return story.save();
      });

      // DB Request: Save the stories
      await Promise.all(saveStoryPromises);
      console.log(`saved ${saveStoryPromises.length} stories`);
    }

    // DB Request: Save the maxItemId as lastProcessedItemId
    await Setting.updateOne(
      { name: "lastProcessedItemId" },
      { value: maxItemId },
      { upsert: true }
    );
    console.log("updated, lastProcessedItemId: " + maxItemId);
  } catch (error) {
    console.log(error);
  } finally {
    isFetchingNewStories = false;
  }
};

const fetchMaxItemAndNewStories = () => {
  // HN Request: get the Max Item ID from /v0/maxitem
  const maxItemRef = ref(firebaseDB, "v0/maxitem");
  onValue(maxItemRef, (snapshot) => {
    const maxItemId = snapshot.val();
    console.log(`Max Item - ${maxItemId} @ ${Date()}`);

    if (!isFetchingNewStories) {
      fetchNewStories(maxItemId);
    }
  });
};

const run = () => {
  fetchMaxItemAndNewStories();
};

module.exports = { run };
