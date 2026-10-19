
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { sendQuestion } from "../services/api";

function Chat() {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async (text = question) => {
    if (!text.trim() || loading) return;

    setSubmittedQuestion(text);
    setQuestion("");
    setAnswer("");
    setLoading(true);

    try {
      const data = await sendQuestion(text);
      setAnswer(data.answer || "No answer received.");
    } catch (error) {
  console.error("Chat error:", error);
  setAnswer(error.message || "Unable to connect to the backend.");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="chat-page">
          <div className="chat-header">
            <div>
              <span className="page-eyebrow">AI WORKSPACE</span>
              <h1>AI Knowledge Assistant</h1>
              <p>
                Get accurate answers from your company documents.
              </p>
            </div>

            <div className="connection-status">
              <span className="status-dot"></span>
              RAG Assistant
            </div>
          </div>

          <section className="chat-container">
            <div className="chat-toolbar">
              <div>
                <h2>Knowledge Chat</h2>
                <p>Ask questions about your indexed documents.</p>
              </div>
              <span className="chat-badge">Document-based AI</span>
            </div>

            <div className="chat-conversation">
              {!submittedQuestion && !answer && !loading && (
                <div className="welcome-message">
                  <div className="welcome-icon">✦</div>
                  <h2>How can I help you today?</h2>
                  <p>
                    Ask a question about your company's policies,
                    procedures, or uploaded documents.
                  </p>

                  <div className="suggested-questions">
                    <button
                      onClick={() =>
                        handleAsk("What is the leave policy?")
                      }
                    >
                      <span>📄</span>
                      <strong>Leave Policy</strong>
                      <small>Understand leave rules</small>
                    </button>

                    <button
                      onClick={() =>
                        handleAsk("What are the working hours?")
                      }
                    >
                      <span>🕒</span>
                      <strong>Working Hours</strong>
                      <small>Check office timings</small>
                    </button>

                    <button
                      onClick={() =>
                        handleAsk("What are the employee benefits?")
                      }
                    >
                      <span>👥</span>
                      <strong>Employee Benefits</strong>
                      <small>Explore available benefits</small>
                    </button>
                  </div>
                </div>
              )}

              {submittedQuestion && (
                <div className="chat-message user-message">
                  <div className="message-avatar user-avatar">You</div>
                  <div className="message-content">
                    <span className="message-label">You</span>
                    <p>{submittedQuestion}</p>
                  </div>
                </div>
              )}

              {(loading || answer) && (
                <div className="chat-message assistant-message">
                  <div className="message-avatar assistant-avatar">
                    ✦
                  </div>
                  <div className="message-content">
                    <span className="message-label">
                      AI Knowledge Assistant
                    </span>
                    <p>
                      {loading ? "Searching documents and generating an answer..." : answer}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <form
              className="chat-input"
              onSubmit={(event) => {
                event.preventDefault();
                handleAsk();
              }}
            >
              <input
                type="text"
                placeholder="Ask anything about your documents..."
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                disabled={loading}
              />

              <button
                type="submit"
                disabled={loading || !question.trim()}
              >
                {loading ? "Thinking..." : "Ask AI"}
                <span>➤</span>
              </button>
            </form>

            <p className="chat-disclaimer">
              AI responses are generated from your indexed knowledge base.
              Please verify important information against the original documents.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Chat;
