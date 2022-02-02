const { ref } = require("firebase/database");
const database = require("./database");

// HN Firebase SDK refs
const item = (id) => ref(database, `v0/item/${id}`);
const maxitem = () => ref(database, "v0/maxitem");
const updates = () => ref(database, "v0/updates");

module.exports = {
  item,
  maxitem,
  updates,
};
