
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        // console.log(`DataBase connected !! Host: ${connectionInstance}`); // it is an object
        console.log(`DataBase connected !! Host: ${connectionInstance.connection.host}`);
        
    } catch(e) {
        console.log(`MongoDB connection FAILED: ${e}`);
        process.exit(1);
    }
}

export default connectDB;

/*

how to connect mongodb??
sol: we need to setup network access and get the connecting string.

- redirect to mongodb Atlas
- do following on overview
    -- setup 'network access' and 'database access'
    -- go to 'database'(at deployment section) and 'connect' it through compass(get the connection string) 
- go to codespace and paste 'connecting string' in .env file
- use async...await and try...catch to connect db 

*/