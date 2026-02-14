// Notes list with per-note actions
export default function NoteList({ notes, onEdit, onDelete, saving, deletingId }) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {notes.map((n) => (
        <div key={n.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
          <h3 style={{ margin: 0 }}>{n.title}</h3>
          <p style={{ whiteSpace: "pre-wrap" }}>{n.content}</p>
          <small>{new Date(n.created_at).toLocaleString()}</small>

          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button type="button" onClick={() => onEdit(n)} disabled={saving || deletingId === n.id}>
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(n.id)}
              disabled={saving || deletingId === n.id}
            >
              {deletingId === n.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
