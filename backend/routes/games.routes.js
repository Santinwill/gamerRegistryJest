const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
});

router.post('/', async (req, res) => {
    const { title, genre, release_year } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "O título do jogo é obrigatório." });
    }

    const result = await pool.query(
        'INSERT INTO games (title, genre, release_year) VALUES ($1,$2,$3) RETURNING *',
        [title, genre, release_year]
    );

    res.status(201).json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
    await pool.query('DELETE FROM games WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
});

module.exports = router;