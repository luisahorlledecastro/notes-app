// Note form for create/edit
export default function NoteForm({
  title,
  content,
  setTitle,
  setContent,
  onSubmit,
  onCancel,
  isEditing,
  saving,
}) {
  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, marginBottom: 20 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        rows={4}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" disabled={saving || !title || !content}>
          {saving ? "Saving…" : isEditing ? "Save changes" : "Add note"}
        </button>

        {isEditing && (
          <button type="button" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}