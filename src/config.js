import { config } from "dotenv";
config();

export const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://admin:admin@cluster0.0zuzt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
export const PORT = process.env.PORT || 3000;
