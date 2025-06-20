import { ContentModel, LinkModel, UserModel } from "../db";
import { userMiddleware } from "../middleware";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.get("/get/usersharestatus", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(403).json({ message: "User not found" });
    return;
  }
  const link = await LinkModel.findOne({ userId });
  res.status(200).json({
    isShareEnable: user.isShareEnable,
    link: link ? `http://localhost:5173/shared/${link.hash}` : "",
  });
});

//Share-link
router.post("/share", userMiddleware, async function (req, res) {
  const userId = req.userId;
  const share = req.body.share;
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(403).json({ message: "User not found" });
    return;
  }
  if (share) {
    try {
      user.isShareEnable = true;
      await user.save();
      let link = await LinkModel.findOne({ userId });
      if (!link) {
        const hash = uuidv4();
        link = await LinkModel.create({ hash, userId });
      }
      res.status(200).json({
        message: "Sharing enabled",
        link: `http://localhost:5173/shared/${link.hash}`, 
      });

      return;
    } catch (err) {
      res
        .status(403)
        .json({ message: "can't create sharable link", error: err });
    }
  } else {
    try {
      user.isShareEnable = false;
      await user.save();
      await LinkModel.findOneAndDelete({ userId });
      res.status(200).json({
        message: "Link successfully disabled",
      });
      return;
    } catch (err) {
      res
        .status(403)
        .json({ message: "can't disable sharable link", error: err });
    }
  }
});

//Get-link
router.get("/:shareLink", async function (req, res) {
  const { shareLink } = req.params;
  try {
    const hash = shareLink;
    let link = await LinkModel.findOne({ hash });
    if (!link) {
      res.status(403).json({ message: "invalid link" });
      return;
    }
    const user = await UserModel.findById(link.userId);
    if (!user || !user.isShareEnable) {
      res.status(403).json({ message: "This user has not enabled sharing" });
      return;
    }
    const contents = await ContentModel.find({ userId: user._id });

    const formattedContent = contents.map((item, index) => ({
      id: index + 1,
      type: item.type,
      link: item.link,
      title: item.title,
      tags: item.tag,
    }));

    res.status(200).json({
      username: user.username,
      content: formattedContent,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch shared content", error: err });
  }
});

export default router;
