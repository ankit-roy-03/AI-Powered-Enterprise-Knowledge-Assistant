import { useState } from "react";
import { ArrowUpRight, Send, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { sendQuestion } from "../services/api";

function AskAI() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const data = await sendQuestion(question.trim());
      setAnswer(data.answer || "No answer was returned.");
    } catch (requestError) {
      setError(requestError.message || "Could not reach the AI assistant.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="ask-ai">
      <div className="ask-ai-header">
        <div className="ai-icon">
          <Sparkles size={20} />
        </div>

        <div>
          <span className="ask-ai-kicker">KNOWLEDGE ASSISTANT</span>
          <h2>What do you need to know?</h2>
          <p>Get an answer grounded in your company documents.</p>
        </div>
      </div>

      <form className="question-box" onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask about a policy, process, or document..."
          aria-label="Ask a question about your documents"
        />

        <button type="submit" disabled={!question.trim() || loading} aria-label="Send question">
          {loading ? "Thinking…" : <><span>Ask AI</span><Send size={17} /></>}
        </button>
      </form>

      {error && <p className="ask-ai-feedback ask-ai-error" role="alert">{error}</p>}
      {answer && (
        <div className="ask-ai-answer" aria-live="polite">
          <span>ANSWER</span>
          <p>{answer}</p>
          <Link to="/chat">Continue in chat <ArrowUpRight size={14} /></Link>
        </div>
      )}

      <div className="suggestions">
        <span>Try</span>
        <button type="button" onClick={() => setQuestion("What is the leave policy?")}>Leave policy</button>
        <button type="button" onClick={() => setQuestion("What are the working hours?")}>Working hours</button>
        <button type="button" onClick={() => setQuestion("Explain the company benefits.")}>Company benefits</button>
      </div>
    </section>
  );
}

export default AskAI;