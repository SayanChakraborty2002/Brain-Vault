import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
import bcrypt, { compare } from "bcrypt";
dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
import { userMiddleware } from "./middleware";

const app = express();
app.use(express.json());

import { ContentModel, UserModel } from "./db";

const requiredSchema = z
  .object({
    username: z
      .string()
      .min(3, "name must be greater than three letters")
      .max(50, "can't be greater than 50 letters"),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[A-Z]/, {
        message: "Must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Must contain at least one digit" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Must contain at least one special character",
      }),
  })
  .strict();

//Sign-up
app.post("/api/v1/signup", async function (req, res) {
  const parsedData = requiredSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(411).json({ message: "Invalid Format" });
    return;
  }
  const { username, password } = parsedData.data;
  try {
    let existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      res
        .status(403)
        .json({ message: " User already exists with this username" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 5);
    await UserModel.create({
      username,
      password: hashedPassword,
    });
    res.status(200).json({ message: "Signed-up successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Sign-in
app.post("/api/v1/signin", async function (req, res) {
  const parsedData = requiredSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(411).json({ message: "Invalid input format" });
    return;
  }
  const { username, password } = parsedData.data;
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "User does not exist" });
      return;
    }
    let hashedPassword = user.password as string;
    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      res.status(411).json({ message: "wrong password" });
      return;
    }
    const authorization = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET_KEY
    );
    res.status(200).json({
      message: "Signed in!",
      authorization: authorization,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

//Post-content
const contentSchema = z.object({
  link: z.string().url(),
  title: z.string(),
  type: z.enum(["image", "video", "article", "audio"]),
  tag: z.array(z.string()).optional(),
});

app.post("/api/v1/content", userMiddleware, async function (req, res) {
  const parsedData = contentSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid content format" });
    return;
  }
  const { link, type, title, tag } = parsedData.data;
  const userId = req.userId;
  try {
    const data = await ContentModel.create({
      link,
      type,
      title,
      userId,
      tag,
    });
    res.status(200).json({ message: "new content added", newContent: data });
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Server error" });
  }
});

//Get-content
app.get("/api/v1/content", userMiddleware, async function (req, res) {
  const userId = req.userId;
  try {
    const content = await ContentModel.find({ userId }).populate(
      "userId",
      "username"
    );
    res.status(200).json({
      content: content,
    });
  } catch (err) {
    res.status(401).json({ message: "no content found", error: err });
  }
});

//Delete-content
app.delete("/api/v1/content",userMiddleware, async function (req, res) {
    const contentId=req.body.contentId;
    const userId=req.userId
    try{
        const result =await ContentModel.deleteOne({
            _id:contentId,
            userId
        })
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "No matching content found to delete" });
            return ;
        }
        res.status(200).json({messgae:"Content deleted"})
    }catch(err){
        res.status(403).json({message:"Can't delete content" , error:err})
    }
});

//Share-link
app.post("/api/v1/brain/share", function (req, res) {});

//Get-link
app.post("/api/v1/brain/:shareLink", function (req, res) {});

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
