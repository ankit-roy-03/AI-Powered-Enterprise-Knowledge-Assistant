
import { useState, useEffect, useRef } from "react";
import { Search, Bell, User, FileText, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getDocuments } from "../services/api";
import { getCurrentUser, logout } from "../services/auth";

function Navbar() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    async function loadDocuments() {
      try {
        const data = await getDocuments();
        setDocuments(data.documents || []);
      } catch (err) {
        console.error("Unable to load documents:", err);
        setError("Unable to load documents.");
      }
    }

    loadDocuments();
  }, []);

  const filteredDocuments = documents.filter((document) =>
    document.filename
      ?.toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const handleSelectDocument = (filename) => {
    setSearch(filename);
    setShowResults(false);

    // Open the Documents page.
    window.location.href = "/documents";
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-search-wrapper" ref={searchRef}>
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setShowResults(true);
              setError("");
            }}
            onFocus={() => setShowResults(true)}
            onKeyDown={(event) => {
              if (
                event.key === "Escape"
              ) {
                setShowResults(false);
              }

              if (
                event.key === "Enter" &&
                filteredDocuments.length > 0
              ) {
                handleSelectDocument(
                  filteredDocuments[0].filename
                );
              }
            }}
          />

          {search && (
            <button
              type="button"
              className="search-clear"
              onClick={() => {
                setSearch("");
                setShowResults(true);
              }}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {showResults && search.trim() && (
          <div className="search-results">
            {error ? (
              <p className="search-empty">{error}</p>
            ) : filteredDocuments.length > 0 ? (
              <>
                <div className="search-results-heading">
                  Matching documents
                </div>

                {filteredDocuments.map((document) => (
                  <button
                    type="button"
                    className="search-result-item"
                    key={document.filename}
                    onClick={() =>
                      handleSelectDocument(document.filename)
                    }
                  >
                    <span className="search-file-icon">
                      <FileText size={18} />
                    </span>

                    <span className="search-result-name">
                      {document.filename}
                      <small>{document.status || "Indexed"}</small>
                    </span>
                  </button>
                ))}
              </>
            ) : (
              <p className="search-empty">
                No documents found for "{search}"
              </p>
            )}
          </div>
        )}
      </div>

      <div className="navbar-right">
        <button
          type="button"
          className="icon-button"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="profile">
          <div className="profile-avatar">
            <User size={18} />
          </div>

          <div className="profile-info">
            <strong>{user?.name || "Admin User"}</strong>
            <span>{user?.role || "Administrator"}</span>
          </div>
        </div>

        <button type="button" className="logout-button" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
