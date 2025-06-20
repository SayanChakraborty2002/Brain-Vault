// src/utils/embed.ts
type EmbeddingResult = { data: Float32Array };



// Initialize immediately as a promise// src/utils/embed.ts
const MODEL_NAME = 'Xenova/e5-large-v2'; // 1024-dimensional model
const EMBEDDING_DIM = 1024;

const embedderPromise = (async () => {
  const { pipeline } = await Function('return import("@xenova/transformers")')();
  const instance = await pipeline('feature-extraction', MODEL_NAME);
  
  // Verify dimension
  const testOutput = await instance("test", { pooling: 'mean', normalize: true });
  if (testOutput.data.length !== EMBEDDING_DIM) {
    throw new Error(`Model outputs ${testOutput.data.length} dimensions, expected ${EMBEDDING_DIM}`);
  }
  
  return instance;
})();
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text.trim()) return Array(EMBEDDING_DIM).fill(0);

  try {
    const embedder = await embedderPromise;
    const { data } = await embedder(text, { 
      pooling: 'mean', 
      normalize: true 
    });
    return Array.from(data);
  } catch (err) {
    console.error('Embedding generation failed:', err);
    throw new Error('Failed to generate embedding');
  }
}