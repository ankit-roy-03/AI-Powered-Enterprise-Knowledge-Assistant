const API_URL = "http://127.0.0.1:8000";

export async function checkBackend() {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend health check failed");
  }

  return await response.json();
}

export async function sendQuestion(question) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to generate an answer"
    );
  }

  return data;
}

export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Document upload failed"
    );
  }

  return data;
}

export async function getDocuments() {
  const response = await fetch(`${API_URL}/documents`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch documents"
    );
  }

  return data;
}
  