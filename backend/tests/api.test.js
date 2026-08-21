const request = require("supertest");
const app = require("../app");
const pool = require("../db");

test("GET /games deve retornar status 200", async () => {
  const response = await request(app).get("/api/games");
  expect(response.statusCode).toBe(200);
});

test("GET /games retorna uma lista", async () => {
  const response = await request(app).get("/api/games");
  expect(Array.isArray(response.body)).toBe(true);
});

test("POST /api/games cria um novo jogo", async () => {
  const response = await request(app)
                          .post("/api/games")
                          .send({
                            title: "Teste Automatizado",
                            genre: "RPG",
                            release_year: 2024
                          });
  expect(response.statusCode).toBe(201);
  expect(response.body.title).toBe("Teste Automatizado");
});

test("POST /games sem nome deve retornar erro", async () => {
  const response = await request(app)
                          .post("/api/games")
                          .send({});
  expect(response.statusCode).toBe(400);
});

afterAll(async () => {
  await pool.end(); 
});