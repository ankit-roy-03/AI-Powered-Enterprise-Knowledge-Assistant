
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import AskAI from "../components/AskAI";
import RecentDocuments from "../components/RecentDocuments";
import { ArrowUpRight, CheckCheck, Files, Gauge, MessageSquareText } from "lucide-react";
import { Link } from "react-router-dom";
import { getDocuments } from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        setError("");

        const data = await getDocuments();
        setDocuments(data.documents || []);
      } catch (err) {
        setError(err.message || "Could not load documents.");
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const totalDocuments = documents.length;
  const indexedDocuments = documents.filter(
    (doc) => doc.status === "Indexed"
  ).length;

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="dashboard-page">
          <header className="dashboard-header">
            <div>
              <span className="dashboard-eyebrow">YOUR WORKSPACE</span>
              <h1>Knowledge, at a glance.</h1>
              <p>Your company knowledge is ready when you need it.</p>
            </div>
            <Link className="dashboard-upload-link" to="/documents">
              Manage documents <ArrowUpRight size={16} />
            </Link>
          </header>

          {error && <p className="dashboard-error" role="alert">{error}</p>}

          <div className="stats-grid">
            <StatCard
              title="Total Documents"
              value={loading ? "..." : totalDocuments}
              description="In your knowledge library"
              icon={Files}
              tone="blue"
            />

            <StatCard
              title="Indexed Documents"
              value={loading ? "..." : indexedDocuments}
              description="Ready for AI answers"
              icon={CheckCheck}
              tone="green"
            />

            <StatCard
              title="Index Coverage"
              value={loading ? "..." : `${totalDocuments ? Math.round((indexedDocuments / totalDocuments) * 100) : 0}%`}
              description={loading ? "Checking document status" : `${totalDocuments - indexedDocuments} documents not indexed`}
              icon={Gauge}
              tone="amber"
            />

            <StatCard
              title="AI Questions"
              value="—"
              description="Usage tracking not enabled"
              icon={MessageSquareText}
              tone="coral"
            />
          </div>

          <div className="dashboard-content-grid">
            <AskAI />
            <RecentDocuments documents={documents} loading={loading} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
