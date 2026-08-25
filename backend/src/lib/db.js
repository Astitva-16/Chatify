import mongoose from "mongoose";

export async function connectDB() {
    try {
       const mongoURI = process.env.MONGODB_URI;

       if(!mongoURI) {
        throw new Error("MONGODB_URI is requried");
       }

       const conn = await mongoose.connect(mongoURI);

       console.log("MogoDB connected: ", conn.connection.host);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1); // Exit the process with failure
    }

}