const { ref, onValue, get } = require("firebase/database");
const firebaseRef = require("./firebase/refs");
const { numbersInRange } = require("../utils/numbers");
const { filterJustStories } = require("./filters");
const Setting = require("./models/setting");
const Story = require("./models/story");

let isFetchingNewStories = false;

const getItemIdsToProcess = async (itemId) => {
  const latestItemId = parseInt(itemId);
  if (Number.isNaN(latestItemId)) return [];

  // DB Request: get it from setting
  const setting = await Setting.findOne({
    name: "lastProcessedItemId",
  });
  console.log("lastProcessedItemId: ", setting.value);
  // or set any min item's id (this could be any number less than maxitem so doing -1000 here)
  const lastProcessedItemId = setting?.value ?? latestItemId - 1000;

  return numbersInRange(lastProcessedItemId, latestItemId);
};

const fetchAndUpdateStories = async (itemIds) => {
  const itemPromies = itemIds.map((id) => get(firebaseRef.item(id)));
  const itemSnapshots = await Promise.all(itemPromies);
  const newStories = itemSnapshots.map((snapshot) =>
    snapshot.exists() ? snapshot.val() : {}
  );
  const justStories = filterJustStories(newStories);

  console.log(
    `justStories count: ${justStories?.length} (out of ${newStories?.length} newStories)`
  );

  if (justStories?.length) {
    const saveStoryPromises = justStories.map((item) =>
      Story.updateOne({ id: item.id }, { ...item }, { upsert: true })
    );

    // DB Request: Save the stories
    await Promise.all(saveStoryPromises);
    console.log(`Upserted, ${saveStoryPromises.length} stories`);
  }
};

const fetchNewStories = async (maxItemId) => {
  isFetchingNewStories = true;
  try {
    const itemIdsToProcess = await getItemIdsToProcess(maxItemId);
    console.log({ itemIdsToProcess });

    await fetchAndUpdateStories(itemIdsToProcess);

    // DB Request: Save the maxItemId as lastProcessedItemId
    await Setting.updateOne(
      { name: "lastProcessedItemId" },
      { value: maxItemId },
      { upsert: true }
    );
    console.log("Updated, lastProcessedItemId: ", maxItemId);
  } catch (error) {
    console.log(error);
  } finally {
    isFetchingNewStories = false;
  }
};

const fetchMaxItemAndNewStories = () => {
  console.log("fetching maxItem...");
  onValue(firebaseRef.maxitem(), (snapshot) => {
    const maxItemId = snapshot.val();
    console.log(`HN MaxItem: ${maxItemId} @ ${Date()}`);
    if (!isFetchingNewStories) {
      fetchNewStories(maxItemId);
    }
  });
};

const listenUpdates = () => {
  onValue(firebaseRef.updates(), (snapshot) => {
    const updates = snapshot.val();
    console.log(`HN Updates: ${updates.items?.length} items @ ${Date()}`);
    if (updates.items?.length) {
      fetchAndUpdateStories(updates.items);
    }
  });
};

const run = () => {
  fetchMaxItemAndNewStories();
  listenUpdates();
};

module.exports = { run };
