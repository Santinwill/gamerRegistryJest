const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
const pool = require('./db');

async function setupDatabase() {
    const clientDefault = new Client({
        user: 'postgres',
        host: 'localhost',
        password: 'postgres', // <-- Verifique se está igual ao seu db.js
        port: 5432,
        database: 'postgres'
    });

    try {
        console.log('⏳ Verificando existência do banco de dados...');
        await clientDefault.connect();

        const dbCheck = await clientDefault.query("SELECT 1 FROM pg_database WHERE datname = 'gamer_registry'");
        
        if (dbCheck.rowCount === 0) {
            console.log('✨ Banco "gamer_registry" não encontrado. Criando...');
            await clientDefault.query('CREATE DATABASE gamer_registry');
            console.log('✅ Banco "gamer_registry" criado com sucesso!');
        } else {
            console.log('ℹ️ Banco "gamer_registry" já existe.');
        }
        
        await clientDefault.end();

        console.log('⏳ Estruturando tabelas e dados...');
        
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const seedPath = path.join(__dirname, '../database/seed.sql');

        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        await pool.query(schemaSql);
        console.log('✅ Tabelas verificadas/criadas com sucesso.');

        const countRes = await pool.query('SELECT COUNT(*) FROM gamers');
        if (parseInt(countRes.rows[0].count) === 0) {
            await pool.query(seedSql);
            console.log('🌱 Dados iniciais (Seed) injetados com sucesso.');
        } else {
            console.log('ℹ️ O banco já possui registros. Seed pulado.');
        }

    } catch (error) {
        console.error('❌ Erro crítico na automação do banco de dados:', error.message);
        try { await clientDefault.end(); } catch (e) {}
    }
}

module.exports = setupDatabase;