import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors"

import authRoutes from "./routes/auth";
import contentRoutes from "./routes/content";
import shareRoutes from "./routes/share";
import groqchatRoute from './routes/groqchat'; 

const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/v1/groqchat', groqchatRoute);
app.use("/api/v1",authRoutes);
app.use("/api/v1/content",contentRoutes);
app.use("/api/v1/sharebrain",shareRoutes);

const Mongo_Url = process.env.MONGO_URL as string;
const PORT = 3000;
async function main() {
  try {
    await mongoose.connect(Mongo_Url);
    app.listen(PORT, () => console.log(`server is listening on port ${PORT} `));
  } catch (e) {
    console.log("can't connect to database", e);
    process.exit(1);
  }
}

main();
