INSERT INTO gamers (nickname, email)
VALUES
    ('PlayerOne', 'player1@email.com'),
    ('NoobMaster', 'noob@email.com')
ON CONFLICT (email) DO NOTHING;

INSERT INTO games (title, genre, release_year)
VALUES
    ('Valorant', 'FPS', 2020),
    ('Minecraft', 'Sandbox', 2011);

INSERT INTO gamer_games (gamer_id, game_id)
VALUES
    (1,1),
    (1,2),
    (2,2)
ON CONFLICT DO NOTHING;