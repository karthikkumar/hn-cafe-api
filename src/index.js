const { initializeApp } = require("firebase/app");
const { getDatabase, ref, onValue, get } = require("firebase/database");

const firebaseConfig = {
  databaseURL: "https://hacker-news.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const userId = "karthikkumar_k";
const userRef = ref(database, `v0/user/${userId}`);

// get once

get(userRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const userData = snapshot.val();
      console.log({ userData });
    } else {
      console.log("User data is not available!");
    }
  })
  .catch((error) => {
    console.error(error);
  });

// or listen to value changes

onValue(userRef, (snapshot) => {
  const userData = snapshot.val();
  console.log({ userData });
});
