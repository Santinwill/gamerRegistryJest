const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

/* ===== ROTAS DA API ===== */
const gamersRoutes = require('./routes/gamers.routes');
const gamesRoutes = require('./routes/games.routes');
const gamerGamesRoutes = require('./routes/gamerGames.routes');

app.use('/api/gamers', gamersRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/gamer-games', gamerGamesRoutes);

/* ===== FRONTEND ===== */
app.use(express.static(path.join(__dirname, '../frontend')));

/* ===== ROTA PADRÃO ===== */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

module.exports = app;