// urzywamy mongoose i colors
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); // zwraca Promise

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.massage}`.red.underline.bold);
    process.exit(1); // jeżeli error to przerywa cały proces
  }
};

module.exports = connectDB;
