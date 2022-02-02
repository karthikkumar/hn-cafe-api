const axios = require("axios");
const moment = require("moment");
const { ref, onValue, get } = require("firebase/database");
const firebaseDB = require("./firebase/database");
const { numbersInRange } = require("../utils/numbers");
const filters = require("./filters");

const getItemIdsToProcess = (itemId) => {
  const latestItemId = parseInt(itemId);
  console.log({
    latestItemId,
    type: typeof latestItemId,
    isNumber: !Number.isNaN(latestItemId),
  });
  if (Number.isNaN(latestItemId)) return [];

  // TODO: get it from mongoDB
  const lastProcessedItemId = latestItemId - 1000;

  return numbersInRange(lastProcessedItemId, latestItemId);
};

const fetchNewStories = async (maxItemId) => {
  try {
    const itemIdsToProcess = getItemIdsToProcess(maxItemId);
    console.log({ itemIdsToProcess });
    const itemPromies = itemIdsToProcess.map(
      // HN Request: get item by id
      (itemId) => get(ref(firebaseDB, `v0/item/${itemId}`))
    );
    const itemSnapshots = await Promise.all(itemPromies);
    const newStories = itemSnapshots.map((snapshot) =>
      snapshot.exists() ? snapshot.val() : {}
    );
    const justStories = filters.justStories(newStories);

    console.log({ justStories, count: justStories.length });

    // TODO
    // Store the stories
    // Store the maxItemId as lastProcessedItemId
  } catch (error) {
    console.log({ error });
  }
};

const fetchMaxItemAndNewStories = () => {
  // HN Request: get the Max Item ID from /v0/maxitem
  const maxItemRef = ref(firebaseDB, "v0/maxitem");
  onValue(maxItemRef, (snapshot) => {
    const maxItemId = snapshot.val();
    console.log(
      `Max Item - ${maxItemId} @ ${moment().format("DD-MM-YYYY hh:mm:ss a")}`
    );
    fetchNewStories(maxItemId);
  });
};

const run = () => {
  fetchMaxItemAndNewStories();
};

module.exports = { run };
