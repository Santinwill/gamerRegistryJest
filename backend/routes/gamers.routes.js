const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM gamers');
    res.json(result.rows);
});

router.post('/', async (req, res) => {
    const { nickname, email } = req.body;
    const result = await pool.query(
        'INSERT INTO gamers (nickname, email) VALUES ($1,$2) RETURNING *',
        [nickname, email]
    );
    res.json(result.rows[0]);
});

router.delete('/:id', async (req, res) => {
    await pool.query('DELETE FROM gamers WHERE id = $1', [req.params.id]);
    res.sendStatus(204);
});

module.exports = router;