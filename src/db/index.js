
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {

    } catch(e) {
        console.log("MongoDB connection Error: ", e);
        process.exit(1);
    }
}
