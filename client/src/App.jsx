import { useEffect, useState } from "react";

// Backend base URL from Vite env
const API = import.meta.env.VITE_API_URL;

export default function App() {
  // Notes from API
  const [notes, setNotes] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Edit mode: null means "creating new", otherwise holds note id
  const [editingId, setEditingId] = useState(null);

  // Request state
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch notes from backend
  async function loadNotes() {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${API}/notes`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // Reset form back to "create" mode
  function resetForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  // Enter edit mode and prefill form
  function startEdit(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  // Create or update note
  async function submitNote(e) {
    e.preventDefault();
    if (saving) return; // prevent double-submit

    try {
      setError("");
      setSaving(true);

      const isEditing = editingId !== null;
      const url = isEditing ? `${API}/notes/${editingId}` : `${API}/notes`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const savedNote = await res.json();

      if (isEditing) {
        setNotes((prev) => prev.map((n) => (n.id === savedNote.id ? savedNote : n)));
      } else {
        setNotes((prev) => [savedNote, ...prev]);
      }

      resetForm();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  // Delete note
  async function deleteNote(id) {
    if (deletingId === id) return; // prevent spam-click

    try {
      setError("");
      setDeletingId(id);

      const res = await fetch(`${API}/notes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  // Initial load
  useEffect(() => {
    loadNotes();
  }, []);

  const isEditing = editingId !== null;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Notes</h1>

      {/* Create / edit form */}
      <form onSubmit={submitNote} style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          rows={4}
        />

        {/* Primary action changes based on edit mode */}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" disabled={saving || !title || !content}>
            {saving ? "Saving…" : isEditing ? "Save changes" : "Add note"}
          </button>


          {/* Cancel only matters while editing */}
          {isEditing && (
              <button type="button" onClick={resetForm} disabled={saving}>
                Cancel
              </button>
          )}
        </div>
      </form>

      {/* Loading / error / empty states */}
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!loading && !error && notes.length === 0 && <p>No notes yet.</p>}

      {/* Notes list */}
      <div style={{ display: "grid", gap: 12 }}>
        {notes.map((n) => (
          <div key={n.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>{n.title}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{n.content}</p>
            <small>{new Date(n.created_at).toLocaleString()}</small>

            {/* Per-note actions */}
            <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
              <button type="button" onClick={() => startEdit(n)} disabled={saving || deletingId === n.id}>
                Edit
              </button>
              <button type="button" onClick={() => deleteNote(n.id)} disabled={saving || deletingId === n.id}>
                {deletingId === n.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}