const app = require("./app");
const setupDatabase = require('./init-db');

app.listen(3000, async () => {
    await setupDatabase(); 
    console.log('Servidor rodando em http://localhost:3000');
});