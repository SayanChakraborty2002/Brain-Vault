import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
import {  UserModel } from "../db";

const router=express.Router();

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
router.post("/signup", async function (req, res) {
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
router.post("/signin", async function (req, res) {
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

export default router;