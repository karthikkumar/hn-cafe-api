const axios = require("axios");
const moment = require("moment");
const { ref, onValue } = require("firebase/database");
const firebaseDB = require("./firebase/database");

const canStopAtItem = (itemId) => {
  // TODO
  // stop just before at
  // last processed itemId
  // or
  // point in time
};

const fetchMaxItemAndTraverseBack = () => {
  // get the max item from /v0/maxitem
  const maxItemRef = ref(firebaseDB, "v0/maxitem");
  onValue(maxItemRef, (snapshot) => {
    const maxItem = snapshot.val();
    console.log(
      `Max Item - ${maxItem} @ ${moment().format("DD-MM-YYYY hh:mm:ss a")}`
    );
  });
};

const run = () => {
  fetchMaxItemAndTraverseBack();
};

module.exports = { run };

// get once
// ----------------------------------------------------------------------------
// const userId = "karthikkumar_k";
// const userRef = ref(database, `v0/user/${userId}`);
// get(userRef)
//   .then((snapshot) => {
//     if (snapshot.exists()) {
//       const userData = snapshot.val();
//       console.log({ userData });
//     } else {
//       console.log("User data is not available!");
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// or listen to value changes
// ----------------------------------------------------------------------------
// const updatesRef = ref(database, "v0/updates");
// onValue(updatesRef, (snapshot) => {
//   const updates = snapshot.val();
//   console.log(
//     `Updates: ${updates.items?.length} items @ ${moment().format(
//       "DD-MM-YYYY hh:mm:ss a"
//     )}`
//   );
// });
