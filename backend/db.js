const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gamer_registry',
    password: 'postgres', // <-- ADICIONE A SENHA CORRETA
    port: 5432,
});

module.exports = pool;