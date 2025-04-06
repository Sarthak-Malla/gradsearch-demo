import chromaService from "../chroma/config.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function testSearch() {
  try {
    // Initialize ChromaDB
    try {
      await chromaService.init();
      console.log("Initialized ChromaDB");
    } catch (error) {
      // If the error is about the collection already existing, we can continue
      if (error.message && error.message.includes("already exists")) {
        console.log("Collection already exists, continuing with search...");
        // Make sure we have a reference to the existing collection
        if (!chromaService.jobsCollection) {
          chromaService.jobsCollection =
            await chromaService.client.getCollection({
              name: chromaService.collectionName,
            });
        }
      } else {
        // For other errors, we should still throw
        throw error;
      }
    }

    // Sample search queries
    const queries = [
      "machine learning engineer",
      "software developer with React experience",
      "remote data science jobs",
      "entry level frontend developer",
      "product manager with agile experience",
    ];

    for (const query of queries) {
      console.log(`\nSearching for: "${query}"`);
      const results = await chromaService.searchJobs(query, 3);

      if (
        results.metadatas &&
        results.metadatas.length > 0 &&
        results.metadatas[0].length > 0
      ) {
        console.log(`Found ${results.metadatas[0].length} results:`);

        for (let i = 0; i < results.metadatas[0].length; i++) {
          const metadata = results.metadatas[0][i];
          console.log(
            `${i + 1}. ${metadata.title} at ${metadata.company} (${
              metadata.location
            })`
          );
        }
      } else {
        console.log("No results found");
      }
    }
  } catch (error) {
    console.error("Error testing search:", error);
  } finally {
    process.exit(0);
  }
}

// Run the function
testSearch();
