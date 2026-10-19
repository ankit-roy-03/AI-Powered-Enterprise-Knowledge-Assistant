
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Upload, FileText, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { uploadDocument, getDocuments } from "../services/api";

function Documents() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchDocuments = async () => {
    try {
      setError("");
      const data = await getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
      setError("Could not load documents. Check whether the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const data = await uploadDocument(selectedFile);

      alert(
        `${data.filename} uploaded successfully! ${data.chunks_created} chunks created.`
      );

      setSelectedFile(null);
      await fetchDocuments();
    } catch (err) {
      console.error(err);
      setError("Upload failed. Check the backend terminal for details.");
    } finally {
      setUploading(false);
    }
  };

  const getFileType = (filename) => {
    return filename.split(".").pop()?.toUpperCase() || "FILE";
  };

  return (
    <div>
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <main className="documents-page">
          <div className="documents-header">
            <div>
              <h1>Documents</h1>
              <p>Manage documents used by the AI knowledge system.</p>
              <p>Total documents: {documents.length}</p>
            </div>

            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              <Upload size={18} />
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </div>

          <div className="upload-area">
            <FileText size={40} />

            <h2>Upload your documents</h2>

            <p>
              Upload PDF, DOCX or TXT files to add them to the knowledge base.
            </p>

            <label className="choose-file">
              Choose File
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                hidden
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
              />
            </label>

            {selectedFile && (
              <p>
                Selected file: <strong>{selectedFile.name}</strong>
              </p>
            )}
          </div>

          {error && <p role="alert">{error}</p>}

          <div className="documents-table">
            <div className="documents-header">
              <h2>All Documents</h2>

              <button onClick={fetchDocuments} disabled={loading}>
                <RefreshCw size={16} /> Refresh
              </button>
            </div>

            <div className="document-row document-heading">
              <span>Document</span>
              <span>Type</span>
              <span>Status</span>
              <span>Size</span>
            </div>

            {loading ? (
              <p>Loading documents...</p>
            ) : documents.length === 0 ? (
              <p>No indexed documents found. Upload a document to get started.</p>
            ) : (
              documents.map((document) => (
                <div className="document-row" key={document.filename}>
                  <span>{document.filename}</span>
                  <span>{getFileType(document.filename)}</span>
                  <span className="status-success">
                    {document.status}
                  </span>
                  <span>—</span>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Documents;
