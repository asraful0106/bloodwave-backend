import mongoose from "mongoose";
import { envVars } from "../config/envVars";
import dns from "dns";

const connectToDb = async () => {
  try {
    dns.setServers(["1.1.1.1","8.8.8.8"]);
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to databse!");
  } catch (err) {
    console.log("Unable to connect to the database!", err);
  }
};

export default connectToDb;
