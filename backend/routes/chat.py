from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

try:
    from backend.rag.retriever import retrieve_chunks
    from backend.rag.generator import generate_answer
except ImportError:
    from rag.retriever import retrieve_chunks
    from rag.generator import generate_answer

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty."
        )

    try:
        print("CHAT 1: Request received", flush=True)

        print("CHAT 2: Retrieving document chunks...", flush=True)
        chunks = retrieve_chunks(question, top_k=3)
        print(f"CHAT 3: Retrieved {len(chunks)} chunks", flush=True)

        if not chunks:
            return {
                "question": question,
                "answer": (
                    "I could not find relevant information "
                    "in the uploaded documents."
                ),
                "sources": []
            }

        context = "\n\n".join(chunks)

        print("CHAT 4: Calling Gemini...", flush=True)
        answer = generate_answer(question, context)
        print("CHAT 5: Gemini response received", flush=True)

        return {
            "question": question,
            "answer": answer,
            "sources": chunks
        }

    except Exception as error:
        print(f"CHAT ERROR: {error!r}", flush=True)
        raise HTTPException(
            status_code=500,
            detail=f"Chat failed: {error}"
        ) from error
