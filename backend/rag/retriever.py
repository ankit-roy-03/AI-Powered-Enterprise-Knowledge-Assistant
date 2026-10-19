
try:
    from backend.rag.vector_store import collection
except ImportError:
    from rag.vector_store import collection


def retrieve_chunks(question, top_k=3):
    results = collection.query(
        query_texts=[question],
        n_results=top_k
    )

    documents = results.get("documents", [[]])[0]
    return documents
