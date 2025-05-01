import express from "express";
import { z } from "zod";
import { userMiddleware } from "../middleware";
import { ContentModel } from "../db";

const router = express.Router();

//Post-content
const contentSchema = z.object({
  link: z.string().url(),
  title: z.string(),
  type: z.enum(["image", "video", "article", "audio"]),
  tag: z.array(z.string()).optional(),
});

router.post("/postcontent", userMiddleware, async function (req, res) {
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
router.get("/getcontent", userMiddleware, async function (req, res) {
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
router.delete("/deletecontent", userMiddleware, async function (req, res) {
  const contentId = req.body.contentId;
  const userId = req.userId;
  try {
    const result = await ContentModel.deleteOne({
      _id: contentId,
      userId,
    });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "No matching content found to delete" });
      return;
    }
    res.status(200).json({ messgae: "Content deleted" });
  } catch (err) {
    res.status(403).json({ message: "Can't delete content", error: err });
  }
});

export default router;
