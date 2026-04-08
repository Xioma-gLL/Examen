import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        if (!process.env.URI) {
            throw new Error("La variable URI no esta definida en el archivo .env");
        }

        await mongoose.connect(process.env.URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectToDB;