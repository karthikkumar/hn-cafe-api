const { initializeApp } = require("firebase/app");
const { getDatabase } = require("firebase/database");
const config = require("./config");

const app = initializeApp(config);

module.exports = getDatabase(app);
