import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  CircleAlert,
  Database,
  FileStack,
  Files,
  Layers3,
  RefreshCw,
  ScanText,
  Sparkles,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { getDocuments } from "../services/api";
import "./KnowledgeBase.css";

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

function KnowledgeBase() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDocuments() {
    try {
      const data = await getDocuments();
      setDocuments(data.documents || []);
      setError("");
    } catch (err) {
      setError(err.message || "Could not load the knowledge base.");
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
        if (active) setError(err.message || "Could not load the knowledge base.");
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
  const attentionDocuments = documents.length - indexedDocuments;
  const coverage = documents.length
    ? Math.round((indexedDocuments / documents.length) * 100)
    : 0;
  const formats = new Set(documents.map((document) => document.file_type?.toLowerCase()).filter(Boolean));
  const recentDocuments = documents.slice(0, 6);

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="knowledge-page">
          <header className="knowledge-header">
            <div>
              <span className="knowledge-eyebrow">KNOWLEDGE SYSTEM</span>
              <h1>Knowledge base</h1>
              <p>Source library and indexing health for your AI assistant.</p>
            </div>
            <div className="knowledge-header-actions">
              <button
                className="knowledge-refresh"
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError("");
                  loadDocuments();
                }}
                disabled={loading}
                aria-label="Refresh knowledge base"
                title="Refresh knowledge base"
              >
                <RefreshCw size={16} className={loading ? "is-refreshing" : ""} />
                <span>Refresh</span>
              </button>
              <Link className="knowledge-manage-link" to="/documents">
                Manage sources <ArrowUpRight size={16} />
              </Link>
            </div>
          </header>

          {error && <p className="knowledge-error" role="alert">{error}</p>}

          <section className="knowledge-metrics" aria-label="Knowledge base metrics">
            <article className="knowledge-metric">
              <div className="knowledge-metric-label"><Files size={17} />Sources</div>
              <strong>{loading ? "—" : documents.length}</strong>
              <span>Documents in library</span>
            </article>
            <article className="knowledge-metric">
              <div className="knowledge-metric-label"><CheckCircle2 size={17} />Indexed</div>
              <strong>{loading ? "—" : indexedDocuments}</strong>
              <span>Available for retrieval</span>
            </article>
            <article className="knowledge-metric">
              <div className="knowledge-metric-label"><CircleAlert size={17} />Needs attention</div>
              <strong>{loading ? "—" : attentionDocuments}</strong>
              <span>Not currently indexed</span>
            </article>
            <article className="knowledge-metric">
              <div className="knowledge-metric-label"><FileStack size={17} />File formats</div>
              <strong>{loading ? "—" : formats.size}</strong>
              <span>Types represented</span>
            </article>
          </section>

          <section className="knowledge-overview">
            <article className="knowledge-panel knowledge-health-panel">
              <div className="knowledge-panel-heading">
                <div>
                  <span className="knowledge-section-label">INDEX HEALTH</span>
                  <h2>Source readiness</h2>
                </div>
                <span className="knowledge-panel-icon"><Database size={18} /></span>
              </div>
              <div className="knowledge-coverage-value">
                <strong>{loading ? "—" : `${coverage}%`}</strong>
                <span>{loading ? "Checking sources" : "of sources indexed"}</span>
              </div>
              <div
                className="knowledge-coverage-track"
                role="progressbar"
                aria-label="Knowledge base index coverage"
                aria-valuenow={loading ? 0 : coverage}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${loading ? 0 : coverage}%` }} />
              </div>
              <div className="knowledge-health-footer">
                <span><i className="knowledge-status-dot is-ready" />Indexed</span>
                <strong>{loading ? "—" : indexedDocuments}</strong>
                <span><i className="knowledge-status-dot is-pending" />Needs attention</span>
                <strong>{loading ? "—" : attentionDocuments}</strong>
              </div>
            </article>

            <article className="knowledge-panel knowledge-storage-panel">
              <div className="knowledge-panel-heading">
                <div>
                  <span className="knowledge-section-label">VECTOR STORAGE</span>
                  <h2>Retrieval index</h2>
                </div>
                <span className="knowledge-panel-icon is-blue"><Layers3 size={18} /></span>
              </div>
              <div className="knowledge-storage-details">
                <div><span>Vector database</span><strong>ChromaDB</strong></div>
                <div><span>Collection</span><strong>enterprise_documents</strong></div>
                <div><span>Embedding model</span><strong>all-MiniLM-L6-v2</strong></div>
              </div>
            </article>
          </section>

          <section className="knowledge-panel knowledge-pipeline-panel">
            <div className="knowledge-panel-heading">
              <div>
                <span className="knowledge-section-label">FROM SOURCE TO SEARCH</span>
                <h2>Indexing pipeline</h2>
              </div>
              <span className="knowledge-panel-icon is-coral"><Sparkles size={18} /></span>
            </div>
            <div className="knowledge-pipeline">
              <div className="knowledge-pipeline-step">
                <span className="knowledge-pipeline-icon"><Files size={18} /></span>
                <div><strong>Source files</strong><small>PDF, DOCX, TXT</small></div>
              </div>
              <span className="knowledge-pipeline-connector" aria-hidden="true" />
              <div className="knowledge-pipeline-step">
                <span className="knowledge-pipeline-icon is-blue"><ScanText size={18} /></span>
                <div><strong>Text & chunks</strong><small>500 characters · 50 overlap</small></div>
              </div>
              <span className="knowledge-pipeline-connector" aria-hidden="true" />
              <div className="knowledge-pipeline-step">
                <span className="knowledge-pipeline-icon is-coral"><Sparkles size={18} /></span>
                <div><strong>Embeddings</strong><small>Sentence-transformer vectors</small></div>
              </div>
              <span className="knowledge-pipeline-connector" aria-hidden="true" />
              <div className="knowledge-pipeline-step">
                <span className="knowledge-pipeline-icon is-green"><Database size={18} /></span>
                <div><strong>Vector index</strong><small>Persistent ChromaDB storage</small></div>
              </div>
            </div>
          </section>

          <section className="knowledge-panel knowledge-sources-panel">
            <div className="knowledge-panel-heading">
              <div>
                <span className="knowledge-section-label">LIBRARY</span>
                <h2>Recent sources</h2>
              </div>
              <Link className="knowledge-table-link" to="/documents">All documents <ArrowRight size={15} /></Link>
            </div>
            {loading ? (
              <p className="knowledge-empty">Loading sources…</p>
            ) : recentDocuments.length === 0 ? (
              <div className="knowledge-empty-state">
                <span><Files size={20} /></span>
                <p>No sources in the library yet.</p>
                <Link to="/documents">Add your first document <ArrowRight size={14} /></Link>
              </div>
            ) : (
              <div className="knowledge-table-wrap">
                <table className="knowledge-table">
                  <thead><tr><th>Source</th><th>Format</th><th>Added</th><th>Status</th></tr></thead>
                  <tbody>
                    {recentDocuments.map((document) => (
                      <tr key={document.id || `${document.filename}-${document.upload_date}`}>
                        <td><span className="knowledge-source-icon"><FileStack size={16} /></span><strong title={document.filename}>{document.filename}</strong></td>
                        <td><span className="knowledge-format-tag">{document.file_type?.toUpperCase() || "FILE"}</span></td>
                        <td>{formatDate(document.upload_date)}</td>
                        <td><span className={`knowledge-status-tag ${document.status?.toLowerCase() === "indexed" ? "is-indexed" : ""}`}>{document.status || "Unknown"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default KnowledgeBase;