CREATE TABLE IF NOT EXISTS gamers (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre VARCHAR(50),
    release_year INT
);

CREATE TABLE IF NOT EXISTS gamer_games (
    gamer_id INT REFERENCES gamers(id) ON DELETE CASCADE,
    game_id INT REFERENCES games(id) ON DELETE CASCADE,
    PRIMARY KEY (gamer_id, game_id)
);