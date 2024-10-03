import { application } from "express";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";




































const app = express();
;(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);  // do not connect DB directly, use async...await and try...catch

        app.on("error", (e) => {
            console.log("Error:- ", e);
            throw e;
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening at port ${process.env.PORT}`)
        })
    
    } catch(error){
        console.error("Error: ", error);
        throw error;
    }
})()

