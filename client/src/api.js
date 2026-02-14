// API base URL from Vite env
const API = import.meta.env.VITE_API_URL;

// Get all notes
export async function fetchNotes() {
  const res = await fetch(`${API}/notes`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// Create note
export async function createNoteApi(title, content) {
  const res = await fetch(`${API}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// Update note
export async function updateNoteApi(id, title, content) {
  const res = await fetch(`${API}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

// Delete note
export async function deleteNoteApi(id) {
  const res = await fetch(`${API}/notes/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}