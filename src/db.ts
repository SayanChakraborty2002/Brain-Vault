import mongoose, { mongo } from "mongoose";
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const User = new Schema({
  username: { type: String, require: true, unique: true },
  password: String,
});

const Link = new Schema({
  hash: { type: String, require: true },
  userId: { type: objectId, require: true, ref: "users" },
});

const Tag = new Schema({
  title: { type: String, require: true },
});

const contentTypes = ["image", "video", "article", "audio"]; // Extend as needed
const Content = new Schema({
  link: { type: String, require: true },
  type: { type: String, enum: contentTypes, require: true },
  title: { type: String, require: true },
  userId: { type: objectId, ref: "users", require: true },
  tag: [{ type: String, ref: "tags" }],
});

const UserModel = mongoose.model("users", User);
const TagModel = mongoose.model("tags", Tag);
const ContentModel = mongoose.model("contents", Content);
const LinkModel = mongoose.model("links", Link);

export {
  UserModel,
  TagModel,
  ContentModel,
  LinkModel,
};
