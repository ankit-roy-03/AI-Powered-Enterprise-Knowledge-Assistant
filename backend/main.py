from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from backend.routes.chat import router as chat_router
    from backend.routes.documents import router as documents_router
except ImportError:
    from routes.chat import router as chat_router
    from routes.documents import router as documents_router

app = FastAPI()
app.include_router(chat_router)
app.include_router(documents_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {
        "message": "AI Knowledge Assistant Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.post("/chat")
def chat(request: ChatRequest):
    return {
        "answer": f"You asked: {request.question}"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)