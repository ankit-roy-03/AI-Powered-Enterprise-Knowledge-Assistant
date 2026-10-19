import chromadb

try:
    from backend.rag.embeddings import embedding_model
except ImportError:
    from rag.embeddings import embedding_model

# Create persistent ChromaDB client
client = chromadb.PersistentClient(
    path="./chroma_db"
)

# Create or get collection
collection = client.get_or_create_collection(
    name="enterprise_documents"
)


def store_chunks(chunks, document_name):
    if not chunks:
        return 0

    # Convert chunks into vectors
    vectors = embedding_model.embed_documents(chunks)

    # Save chunks, vectors, and metadata
    collection.upsert(
        ids=[
            f"{document_name}_{i}"
            for i in range(len(chunks))
        ],
        documents=chunks,
        embeddings=vectors,
        metadatas=[
            {"source": document_name}
            for _ in chunks
        ]
    )

    return len(chunks)