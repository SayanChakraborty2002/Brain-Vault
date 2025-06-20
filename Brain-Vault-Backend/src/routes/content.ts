import express from "express";
import { z } from "zod";
import { userMiddleware } from "../middleware";
import { ContentModel } from "../db";
import { generateEmbedding } from "../utils/embed";
import { queryTopK, upsertEmbedding } from "../utils/pineconeClient";
const router = express.Router();

//Post-content
const contentSchema = z.object({
  link: z.string().url(),
  title: z.string(),
  type: z.enum([
    "image",
    "video",
    "article",
    "audio",
    "youtube",
    "twitter",
    "linkedin",
  ]),
  tag: z.array(z.string()).optional(),
  description: z.string().optional(),
});
// src/routes/content.ts
// src/routes/content.ts
router.post("/postcontent", userMiddleware, async function (req, res) {
  const parsedData = contentSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Invalid content format" });
    return;
  }

  const { link, type, title, tag, description } = parsedData.data;
  const userId = req.userId; // This should now be guaranteed by your middleware

  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  const chunk_text = [title, ...(tag || []), description || ""].join(" ");

  try {
    // Save to MongoDB
    const data = await ContentModel.create({
      link,
      type,
      title,
      userId,
      tag,
      description,
      chunk_text,
    });

    // Generate embedding
    const embedding = await generateEmbedding(chunk_text);
    if (!embedding?.length) {
      throw new Error("Empty embedding received");
    }

    // Upsert to Pinecone - userId is now guaranteed to exist
    await upsertEmbedding(data._id.toString(), embedding, {
      link,
      type,
      title,
      userId, // This is now validated
      ...(tag && { tag }),
      ...(description && { description }),
    });

    res.status(200).json({ message: "Content added", newContent: data });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Server error" });
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
import { deleteEmbedding } from "../utils/pineconeClient"; // ⬅️ Add this at the top

router.delete("/deletecontent", userMiddleware, async function (req, res) {
  const contentId = req.body.contentId;
  const userId = req.userId;

  try {
    const result = await ContentModel.deleteOne({
      _id: contentId,
      userId,
    });

    if (result.deletedCount === 0) {
       res.status(404).json({ message: "No matching content found to delete" });return
    }

    // 🧹 Also delete from Pinecone
    try {
      await deleteEmbedding(contentId); // 👈 Add this line
    } catch (pineconeError) {
      console.warn("Warning: Failed to delete from Pinecone:", pineconeError);
      // Optional: don't block Mongo deletion success on Pinecone failure
    }

     res.status(200).json({ message: "Content deleted from DB and Pinecone" }); return;
  } catch (err) {
     res.status(500).json({ message: "Can't delete content", error: err });return;
  }
});


// Add user filter to search endpoint
router.post("/search", userMiddleware, async (req, res) => {
  try {
    const { queryText } = req.body;
    const userId = req.userId;

    if (!queryText?.trim()) {
      res.status(400).json({ message: "Query text is required" });
      return;
    }

    const queryEmbedding = await generateEmbedding(queryText);
    const matches = await queryTopK(queryEmbedding, 5);

    // Add user filter to prevent data leakage
    const contents = await ContentModel.find({
      _id: { $in: matches.map((m) => m.id) },
      userId, // Ensure users only see their own content
    });

    res.status(200).json({ results: contents });
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
    return;
  }
});

import { askGroqWithContext } from "../utils/groq"; // 👈 make sure this file exists

router.post("/ragsearch", userMiddleware, async (req, res) => {
  const { queryText } = req.body;
  const userId = req.userId;

  if (!queryText?.trim()) {
    res.status(400).json({ message: "Query text is required" });
    return;
  }

  try {
    // Step 1: Embed the query
    const queryEmbedding = await generateEmbedding(queryText);

    // Step 2: Get top 5 matches from Pinecone for this user
    const matches = await queryTopK(queryEmbedding, 5, userId);

    // Step 3: Build a content context from metadata
    const contextChunks = matches
      .map((match) => {
        const meta = match.metadata;
        if (meta) {
          const tags = Array.isArray(meta.tag)
            ? meta.tag.join(", ")
            : String(meta.tag || "None");
          return `Title: ${meta.title}
Type: ${meta.type}
Link: ${meta.link}
Tags: ${meta.tags}
Description: ${meta.description || "No description"}`;
        }
      })
      .join("\n---\n");

    // Step 4: Build prompt for AI
    const prompt = `
User query: ${queryText}

User's saved content:
${contextChunks}

Based on the above, answer the user's question in a helpful way.
`;

    // Step 5: Ask Groq LLaMA 3
    const aiAnswer = await askGroqWithContext(prompt);

    // Step 6: Send response
    res.status(200).json({
      results: matches.map((m) => m.metadata),
      answer: aiAnswer,
    });
  } catch (err) {
    console.error("RAG search error:", err);
    res.status(500).json({ message: "RAG search failed" });
  }
});

export default router;
