import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mdb = await mongoose.connect(process.env.MONGO_URI);

        console.log(`\nMongo DB connected: ${mdb.connection.host}`);
    } catch (error) {
        console.error("Error connection to Mongo DB", error);

        process.exit(1); // 0 - success, 1 - failure
    }
};
