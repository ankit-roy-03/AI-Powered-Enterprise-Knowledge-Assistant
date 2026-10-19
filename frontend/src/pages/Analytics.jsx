import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  FileStack,
  MessageSquareText,
  RefreshCw,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getDocuments } from "../services/api";
import "./Analytics.css";

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function Analytics() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err.message || "Could not load document analytics.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    getDocuments()
      .then((data) => {
        if (active) setDocuments(data.documents || []);
      })
      .catch((err) => {
        if (active) setError(err.message || "Could not load document analytics.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const indexedDocuments = documents.filter(
    (document) => document.status?.toLowerCase() === "indexed"
  ).length;
  const otherDocuments = documents.length - indexedDocuments;
  const coverage = documents.length
    ? Math.round((indexedDocuments / documents.length) * 100)
    : 0;

  const formats = documents.reduce((counts, document) => {
    const format = document.file_type?.toUpperCase() || "OTHER";
    counts[format] = (counts[format] || 0) + 1;
    return counts;
  }, {});
  const formatRows = Object.entries(formats).sort((left, right) => right[1] - left[1]);
  const maxFormatCount = Math.max(1, ...formatRows.map(([, count]) => count));
  const recentDocuments = [...documents].slice(0, 5);

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="analytics-page">
          <header className="analytics-header">
            <div>
              <span className="analytics-eyebrow">WORKSPACE INSIGHTS</span>
              <h1>Analytics</h1>
              <p>Understand the health and composition of your knowledge base.</p>
            </div>
            <button
              className="analytics-refresh"
              onClick={() => {
                setError("");
                setLoading(true);
                loadDocuments();
              }}
              disabled={loading}
              aria-label="Refresh analytics"
              title="Refresh analytics"
            >
              <RefreshCw size={17} className={loading ? "is-refreshing" : ""} />
              <span>Refresh</span>
            </button>
          </header>

          {error && <p className="analytics-error" role="alert">{error}</p>}

          <section className="analytics-metrics" aria-label="Knowledge base metrics">
            <article className="analytics-metric">
              <div className="analytics-metric-top">
                <span>Documents</span>
                <FileStack size={18} />
              </div>
              <strong>{loading ? "—" : documents.length}</strong>
              <small>Stored in your workspace</small>
            </article>
            <article className="analytics-metric">
              <div className="analytics-metric-top">
                <span>Indexed</span>
                <CheckCircle2 size={18} />
              </div>
              <strong>{loading ? "—" : indexedDocuments}</strong>
              <small>Available to the AI assistant</small>
            </article>
            <article className="analytics-metric">
              <div className="analytics-metric-top">
                <span>Index coverage</span>
                <Database size={18} />
              </div>
              <strong>{loading ? "—" : `${coverage}%`}</strong>
              <small>{loading ? "Checking index status" : `${otherDocuments} needing attention`}</small>
            </article>
            <article className="analytics-metric analytics-metric-muted">
              <div className="analytics-metric-top">
                <span>AI queries</span>
                <Activity size={18} />
              </div>
              <strong>Not tracked</strong>
              <small>Query history is not enabled</small>
            </article>
          </section>

          <section className="analytics-panels">
            <article className="analytics-panel analytics-breakdown">
              <div className="analytics-panel-heading">
                <div>
                  <span className="analytics-panel-kicker">INDEX HEALTH</span>
                  <h2>Document status</h2>
                </div>
                <span className="analytics-panel-icon analytics-icon-green"><Database size={19} /></span>
              </div>
              {loading ? (
                <p className="analytics-empty">Loading index status…</p>
              ) : documents.length === 0 ? (
                <div className="analytics-empty-state">
                  <p>No documents to measure yet.</p>
                  <Link to="/documents">Add documents <ArrowRight size={14} /></Link>
                </div>
              ) : (
                <>
                  <div className="analytics-coverage">
                    <div className="analytics-coverage-copy">
                      <strong>{coverage}%</strong>
                      <span>of documents indexed</span>
                    </div>
                    <div
                      className="analytics-coverage-track"
                      role="progressbar"
                      aria-label="Document index coverage"
                      aria-valuenow={coverage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span style={{ width: `${coverage}%` }} />
                    </div>
                  </div>
                  <div className="analytics-status-legend">
                    <div><span className="analytics-dot indexed-dot" />Indexed <strong>{indexedDocuments}</strong></div>
                    <div><span className="analytics-dot other-dot" />Other status <strong>{otherDocuments}</strong></div>
                  </div>
                </>
              )}
            </article>

            <article className="analytics-panel analytics-breakdown">
              <div className="analytics-panel-heading">
                <div>
                  <span className="analytics-panel-kicker">LIBRARY MIX</span>
                  <h2>File formats</h2>
                </div>
                <span className="analytics-panel-icon analytics-icon-blue"><BarChart3 size={19} /></span>
              </div>
              {loading ? (
                <p className="analytics-empty">Loading file formats…</p>
              ) : formatRows.length === 0 ? (
                <p className="analytics-empty">Format breakdown will appear when documents are added.</p>
              ) : (
                <div className="analytics-format-list">
                  {formatRows.map(([format, count]) => (
                    <div className="analytics-format-row" key={format}>
                      <span>{format}</span>
                      <div className="analytics-format-track" aria-hidden="true">
                        <span style={{ width: `${(count / maxFormatCount) * 100}%` }} />
                      </div>
                      <strong>{count}</strong>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>

          <section className="analytics-panels analytics-lower-panels">
            <article className="analytics-panel analytics-recent-panel">
              <div className="analytics-panel-heading">
                <div>
                  <span className="analytics-panel-kicker">LATEST ACTIVITY</span>
                  <h2>Recently added</h2>
                </div>
                <Link className="analytics-text-link" to="/documents">All documents <ArrowRight size={15} /></Link>
              </div>
              {loading ? (
                <p className="analytics-empty">Loading recent documents…</p>
              ) : recentDocuments.length === 0 ? (
                <div className="analytics-empty-state">
                  <p>Your latest uploads will show up here.</p>
                  <Link to="/documents">Open documents <ArrowRight size={14} /></Link>
                </div>
              ) : (
                <div className="analytics-recent-list">
                  {recentDocuments.map((document) => (
                    <div className="analytics-recent-row" key={document.id || document.filename}>
                      <span className="analytics-file-mark"><FileStack size={17} /></span>
                      <span className="analytics-file-name" title={document.filename}>{document.filename}</span>
                      <span className={`analytics-status-pill ${document.status?.toLowerCase() === "indexed" ? "is-indexed" : ""}`}>
                        {document.status || "Unknown"}
                      </span>
                      <span className="analytics-date"><Clock3 size={14} />{formatDate(document.upload_date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </article>

            <article className="analytics-panel analytics-queries-panel">
              <div className="analytics-panel-heading">
                <div>
                  <span className="analytics-panel-kicker">AI USAGE</span>
                  <h2>Query insights</h2>
                </div>
                <span className="analytics-panel-icon analytics-icon-coral"><MessageSquareText size={19} /></span>
              </div>
              <p>Question volume and response trends are not available because chat activity is not currently recorded.</p>
              <Link to="/chat" className="analytics-chat-link">Go to AI chat <ArrowRight size={15} /></Link>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Analytics;