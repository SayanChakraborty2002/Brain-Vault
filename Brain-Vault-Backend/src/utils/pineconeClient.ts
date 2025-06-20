import { Pinecone } from '@pinecone-database/pinecone';

type PineconeMetadata = {
  link: string;
  type: string;
  title: string;
  userId: string;
  tag?: string[];
  description?: string;
  createdAt?: string;
};

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

// Get the index with proper typing
const index = pinecone.index(process.env.PINECONE_INDEX_NAME!);

export async function deleteEmbedding(id: string) {
  try {
    // Use the namespace method to access the proper delete functionality
    await index.namespace('').deleteOne(id);
    console.log(`🧹 Deleted vector ${id} from Pinecone`);
  } catch (err) {
    console.error("Pinecone delete error:", err);
    throw new Error("Failed to delete embedding from Pinecone");
  }
}

export async function upsertEmbedding(
  id: string,
  embedding: number[],
  metadata: Omit<PineconeMetadata, 'createdAt'>
) {
  try {
    await index.namespace('').upsert([{
      id,
      values: embedding,
      metadata: {
        ...metadata,
        userId: metadata.userId,
        createdAt: new Date().toISOString()
      }
    }]);
  } catch (err) {
    console.error("Pinecone upsert error:", err);
    throw new Error("Failed to upsert embedding");
  }
}

export async function queryTopK(
  embedding: number[], 
  topK: number = 5,
  userId?: string
) {
  try {
    const { matches } = await index.namespace('').query({
      vector: embedding,
      topK,
      includeMetadata: true,
      includeValues: false,
      filter: userId ? { userId: { "$eq": userId } } : undefined
    });

    return matches;
  } catch (err) {
    console.error("Pinecone query failed:", err);
    throw new Error("Search failed");
  }
}

export const pineconeUtils = {
  async describeIndex() {
    return pinecone.describeIndex(process.env.PINECONE_INDEX_NAME!);
  },
  async listIndexes() {
    return pinecone.listIndexes();
  }
};