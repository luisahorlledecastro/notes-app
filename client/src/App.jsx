import { useEffect, useState } from "react";
import NoteForm from "./NoteForm";
import NoteList from "./NoteList";
import { fetchNotes, createNoteApi, updateNoteApi, deleteNoteApi } from "./api";

// App orchestrates state + calls API
export default function App() {
  // Notes data
  const [notes, setNotes] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Edit mode (null = create)
  const [editingId, setEditingId] = useState(null);

  // Request state
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Initial load
  useEffect(() => {
    (async () => {
      try {
        setError("");
        setLoading(true);
        const data = await fetchNotes();
        setNotes(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset form to create mode
  function resetForm() {
    setTitle("");
    setContent("");
    setEditingId(null);
  }

  // Enter edit mode
  function startEdit(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }

  // Create or update
  async function submitNote(e) {
    e.preventDefault();
    if (saving) return;

    try {
      setError("");
      setSaving(true);

      const isEditing = editingId !== null;

      const savedNote = isEditing
        ? await updateNoteApi(editingId, title, content)
        : await createNoteApi(title, content);

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
    if (deletingId === id) return;

    try {
      setError("");
      setDeletingId(id);

      await deleteNoteApi(id);

      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  const isEditing = editingId !== null;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}>
      <h1>Notes</h1>

      <NoteForm
        title={title}
        content={content}
        setTitle={setTitle}
        setContent={setContent}
        onSubmit={submitNote}
        onCancel={resetForm}
        isEditing={isEditing}
        saving={saving}
      />

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!loading && !error && notes.length === 0 && <p>No notes yet.</p>}

      {!loading && !error && notes.length > 0 && (
        <NoteList
          notes={notes}
          onEdit={startEdit}
          onDelete={deleteNote}
          saving={saving}
          deletingId={deletingId}
        />
      )}
    </div>
  );
}
