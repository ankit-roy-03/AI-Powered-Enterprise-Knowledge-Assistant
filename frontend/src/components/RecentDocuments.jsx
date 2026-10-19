import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { Link } from "react-router-dom";

function RecentDocuments({ documents = [], loading = false }) {
  const recentDocuments = documents.slice(0, 4);

  return (
    <section className="recent-documents">
      <div className="section-header">
        <div>
          <span className="recent-kicker">LIBRARY</span>
          <h2>Recent documents</h2>
          <p>Latest files in your knowledge base</p>
        </div>

        <Link className="view-all" to="/documents">View all <ArrowRight size={15} /></Link>
      </div>

      <div className="document-list">
        {loading ? (
          <p className="recent-empty">Loading documents…</p>
        ) : recentDocuments.length === 0 ? (
          <div className="recent-empty-state">
            <span className="file-icon"><FileText size={20} /></span>
            <p>Your library is empty. Add a document to start asking questions.</p>
            <Link to="/documents">Add a document</Link>
          </div>
        ) : recentDocuments.map((document) => (
          <div className="document-item" key={document.id || document.filename}>
            <div className="document-info">
              <div className="file-icon">
                <FileText size={19} />
              </div>

              <div>
                <strong title={document.filename}>{document.filename}</strong>
                <span>{document.file_type?.toUpperCase() || "FILE"} · {formatDate(document.upload_date)}</span>
              </div>
            </div>

            <div className={`document-status ${document.status?.toLowerCase() === "indexed" ? "is-indexed" : "is-pending"}`}>
              {document.status?.toLowerCase() === "indexed" && <CheckCircle2 size={15} />}
              {document.status || "Unknown"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function formatDate(value) {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

export default RecentDocuments;