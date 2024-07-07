const mongoose = require("mongoose");

exports.ConnectDatabase = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(process.env.DATABASE_CONNECTION);
      resolve(true);
    } catch (error) {
      reject(false);
    }
  });
};