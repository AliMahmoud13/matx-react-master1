const mongoose = require("mongoose");

const getConnection = () => {
  try {
    mongoose
      .connect(
        "mongodb+srv://coop:xCSnTXahzeQE85Em@coop.11fjr.mongodb.net/auth"
      )
      .then((getConnection) => {
        console.log("db is connected");
      });
  } catch (error) {
    console.log("faild to connect to db");
  }
};
module.exports = getConnection;
