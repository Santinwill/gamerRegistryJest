// tests/exercicios.test.js

const request = require("supertest");
const app = require("../app");
const pool = require("../db");


// Exercício 1
test("GET /api/games deve retornar status 200", async () => {
  const response = await request(app).get("/api/games");
  expect(response.statusCode).toBe(200);
});

// Exercício 2
test("GET /api/games deve retornar uma lista (Array)", async () => {
  const response = await request(app).get("/api/games");
  expect(Array.isArray(response.body)).toBe(true);
});

// Exercício 3
test("POST /api/games deve criar um novo jogo com sucesso", async () => {
  const response = await request(app)
                            .post("/api/games")
                            .send({
                                title: "The Witcher 3",
                                genre: "RPG"
                            });
  
  expect([200, 201]).toContain(response.statusCode);
});

// Exercício 4
test("POST /api/games com corpo vazio deve retornar status 400", async () => {
  const response = await request(app)
                            .post("/api/games")
                            .send({});
                        
  expect(response.statusCode).toBe(400);
});

// Exercício 5
test("POST /api/games ao criar jogo deve retornar objeto com id, title e genre", async () => {
  const response = await request(app)
                            .post("/api/games")
                            .send({
                                title: "Minecraft",
                                genre: "Sandbox"
                            });
  
  expect([200, 201]).toContain(response.statusCode);
  
  expect(response.body).toHaveProperty("id");
  expect(response.body).toHaveProperty("title");
  expect(response.body).toHaveProperty("genre");
  expect(response.body.title).toBe("Minecraft");
});

// Exercício 6
test("GET /api/games/:id deve buscar um jogo existente pelo ID", async () => {
  const createResponse = await request(app)
                                .post("/api/games")
                                .send({
                                    title: "Borderlands",
                                    genre: "Loot Shooter"
                                });
  
  const jogoId = createResponse.body.id;

  //Busca o jogo criado dinamicamente passando o id na rota
  const response = await request(app).get(`/api/games/${jogoId}`);
  expect(response.statusCode).toBe(200);
  expect(response.body.title).toBe("Borderlands");
});


// Exercício 7 — Buscar jogo inexistente

test("GET /api/games/:id com id inexistente deve retornar 404", async () => {
  const response = await request(app).get("/api/games/9999");
  expect(response.statusCode).toBe(404);
});


// Exercício 8 — Deletar um jogo

test("DELETE /api/games/:id deve excluir o jogo informado", async () => {
  // 1. Cria o jogo que servirá de alvo
  const createResponse = await request(app)
                                .post("/api/games")
                                .send({
                                    title: "Jogo para Deletar",
                                    genre: "Temporário"
                                });
  
  const jogoId = createResponse.body.id;

  const response = await request(app).delete(`/api/games/${jogoId}`);
  expect([200, 204]).toContain(response.statusCode);
});


// Exercício 9 
test("Fluxo Completo: Criar -> Buscar -> Deletar -> Validar Ausência", async () => {
  // 1. Criar jogo
  const createResponse = await request(app)
                                .post("/api/games")
                                .send({
                                    title: "Fluxo Completo",
                                    genre: "Simulador"
                                });
  expect([200, 201]).toContain(createResponse.statusCode);
  const id = createResponse.body.id;

  // 2. Buscar jogo criado
  const getResponse = await request(app).get(`/api/games/${id}`);
  expect(getResponse.statusCode).toBe(200);
  expect(getResponse.body.title).toBe("Fluxo Completo");

  // 3. Deletar jogo
  const deleteResponse = await request(app).delete(`/api/games/${id}`);
  expect([200, 204]).toContain(deleteResponse.statusCode);

  // 4. Verificar se ele não existe mais
  const checkResponse = await request(app).get(`/api/games/${id}`);
  expect(checkResponse.statusCode).toBe(404);
});


afterAll(async () => {
  await pool.end();
});