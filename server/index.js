// Imports
const express = require("express");
const cors = require("cors");

// App setup
const app = express();
app.use(cors());          // allow cross-origin requests
app.use(express.json());  // parse JSON bodies

// DB connection
const pool = require("./db");


// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});


// DB connectivity check
app.get("/dbcheck", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now;");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all notes
app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes ORDER BY created_at DESC;"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /notes failed:", err);
    res.status(500).json({ error: err.message });
  }
});


// Create note
app.post("/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "title and content required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *;",
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /notes failed:", err);
    res.status(500).json({ error: err.message });
  }
});


// Update note
app.put("/notes/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "title and content required" });
  }

  try {
    const result = await pool.query(
      "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *;",
      [title, content, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("PUT /notes/:id failed:", err);
    res.status(500).json({ error: err.message });
  }
});


// Delete note
app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM notes WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ deleted: true });
  } catch (err) {
    console.error("DELETE /notes/:id failed:", err);
    res.status(500).json({ error: err.message });
  }
});


// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running okon port ${PORT}`));