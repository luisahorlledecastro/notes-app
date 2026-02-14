const express = require("express");
const cors = require("cors")

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ ok: true });
});

const pool = require("./db");

app.get("/dbcheck", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as now;");
        res.json(result.rows[0]);
    }   catch(err) {
        res.status(500).json({ error: err.message});
    }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/notes", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM notes ORDER BY created_at DESC;");
        res.json(result.rows);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});