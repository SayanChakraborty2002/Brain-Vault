import mongoose, { mongo } from "mongoose";
import { string } from "zod";
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;

const User = new Schema({
  username: { type: String, required: true, unique: true },
  password:{ type: String, required: true},
  isShareEnable:{type:Boolean, default:false}
});

const Link = new Schema({
  hash: { type: String, required: true },
  userId: { type: objectId, required: true, ref: "users" },
});

const Tag = new Schema({
  title: { type: String, required: true },
});

const contentTypes = ["image", "video", "article", "audio","youtube" ,"twitter", "linkedin"]; // Extend as needed
const Content = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  userId: { type: objectId, ref: "users", required: true },
  tag: [{ type: String, ref: "tags" }],
  description:{type:String},
  embedding: { type: [Number], default: [] },
  chunk_text:String
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
