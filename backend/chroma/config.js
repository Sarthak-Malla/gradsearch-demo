import { ChromaClient, OpenAIEmbeddingFunction } from "chromadb";

class ChromaService {
  constructor() {
    // Don't create client in constructor, for env initialization
    this.client = null;
    this.jobsCollection = null;
    this.collectionName = "jobs-collection";
    this.embedder = null;
  }

  static getInstance() {
    if (!ChromaService.instance) {
      ChromaService.instance = new ChromaService();
    }
    return ChromaService.instance;
  }

  async init() {
    try {
      // Initialize client here, after env vars are loaded
      console.log(
        "Initializing ChromaDB client with host:",
        process.env.CHROMA_HOST,
        "and port:",
        process.env.CHROMA_PORT
      );
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        console.error(
          "OpenAI API key is required but not found in environment variables"
        );
        process.exit(1);
      }

      // Initialize the OpenAI embedding function
      this.embedder = new OpenAIEmbeddingFunction({
        apiKey: OPENAI_API_KEY,
        model: "text-embedding-ada-002",
      });

      if (!this.client) {
        this.client = new ChromaClient({
          path: `http://${process.env.CHROMA_HOST}:${process.env.CHROMA_PORT}`,
        });
      }

      // Check if collection exists, otherwise create it
      const collections = await this.client.listCollections();
      // Fix: Check if collections is an array of strings or objects
      let collectionExists = false;

      if (collections.length > 0) {
        if (typeof collections[0] === "string") {
          // If collections is an array of strings
          collectionExists = collections.includes(this.collectionName);
        } else if (typeof collections[0] === "object" && collections[0].name) {
          // If collections is an array of objects with name property
          collectionExists = collections.some(
            (col) => col.name === this.collectionName
          );
        }
      }

      console.log(
        "Collections:",
        collections,
        "Collection exists:",
        collectionExists
      );

      if (collectionExists) {
        this.jobsCollection = await this.client.getCollection({
          name: this.collectionName,
          embeddingFunction: this.embedder,
        });
        console.log(`Connected to existing collection: ${this.collectionName}`);
      } else {
        this.jobsCollection = await this.client.createCollection({
          name: this.collectionName,
          embeddingFunction: this.embedder,
        });
        console.log(`Created new collection: ${this.collectionName}`);
      }
    } catch (error) {
      console.error("Failed to initialize ChromaDB:", error);
      throw error;
    }
  }

  async addJobs(jobs) {
    if (!this.jobsCollection) {
      throw new Error("Collection not initialized. Call init() first.");
    }

    // Handle empty jobs array
    if (!jobs || jobs.length === 0) {
      console.log("No jobs to add");
      return;
    }

    // Process jobs in batches to avoid overloading the server
    const batchSize = 100;
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batchJobs = jobs.slice(i, i + batchSize);

      // Prepare data for ChromaDB
      const documents = batchJobs.map(
        (job) =>
          `Title: ${job.title || ""}. Company: ${
            job.company || ""
          }. Description: ${job.description || ""}. Location: ${
            job.location || ""
          }`
      );
      const ids = batchJobs.map((job) => encodeURIComponent(job.url)); // Use URL as ID
      const metadatas = batchJobs.map((job) => ({
        title: job.title || "",
        company: job.company || "",
        location: job.location || "",
        url: job.url,
      }));

      try {
        await this.jobsCollection.add({
          ids,
          documents,
          metadatas,
        });
        console.log(
          `Added batch of ${batchJobs.length} jobs to ChromaDB (${i + 1}-${
            i + batchJobs.length
          }/${jobs.length})`
        );
      } catch (error) {
        console.error(`Failed to add batch of jobs to ChromaDB:`, error);
        throw error;
      }
    }
  }

  async searchJobs(query, nResults = 5) {
    if (!this.jobsCollection) {
      throw new Error("Collection not initialized. Call init() first.");
    }

    try {
      const results = await this.jobsCollection.query({
        queryTexts: [query],
        nResults,
      });

      return results;
    } catch (error) {
      console.error("Failed to search jobs in ChromaDB:", error);
      throw error;
    }
  }

  async deleteJob(url) {
    if (!this.jobsCollection) {
      throw new Error("Collection not initialized. Call init() first.");
    }

    try {
      await this.jobsCollection.delete({
        ids: [encodeURIComponent(url)],
      });
      console.log(`Deleted job with URL: ${url}`);
    } catch (error) {
      console.error(`Failed to delete job with URL ${url}:`, error);
      throw error;
    }
  }

  async getJobCount() {
    if (!this.jobsCollection) {
      throw new Error("Collection not initialized. Call init() first.");
    }

    try {
      const count = await this.jobsCollection.count();
      return count;
    } catch (error) {
      console.error("Failed to get job count from ChromaDB:", error);
      throw error;
    }
  }
}

// Create and export the singleton instance
const chromaService = ChromaService.getInstance();
export default chromaService;
