#!/bin/bash

echo "Starting ChromaDB server using Docker..."

# Check if container is already running
CONTAINER=$(docker ps --filter "name=chroma-server" --format "{{.Names}}")

if [ "$CONTAINER" = "chroma-server" ]; then
  echo "ChromaDB server is already running."
else
  # Start ChromaDB Docker container
  docker run -d \
    --name chroma-server \
    -p 8000:8000 \
    -v /tmp/chromadb:/chroma/chroma \
    chromadb/chroma
  
  echo "ChromaDB server started successfully."
  echo "Server is running at http://localhost:8000"
fi