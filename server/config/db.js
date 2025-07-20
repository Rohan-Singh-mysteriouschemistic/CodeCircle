import mongoose from "mongoose";

//DataBase connection Object
const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('Database Connected');
    });
    await mongoose.connect(`${process.env.MONGO_URI}/codespace`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

export default connectDB;
