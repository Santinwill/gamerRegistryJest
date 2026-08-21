const request = require("supertest");
const app = require("../app");
const pool = require("../db");

test("Q1. GET /api/gamers deve retornar status 200", async () => {
  const response = await request(app).get("/api/gamers");
  expect(response.statusCode).toBe(200);
});

test("Q2. GET /api/gamers deve retornar um Array", async () => {
  const response = await request(app).get("/api/gamers");
  expect(Array.isArray(response.body)).toBe(true);
});

test("Q3. POST /api/gamers deve cadastrar um novo gamer com sucesso", async () => {
  const emailDinamico = `faker-${Date.now()}@email.com`;
  
  const response = await request(app)
                        .post("/api/gamers")
                        .send({
                            nickname: "Faker",
                            email: emailDinamico
                        });

  expect(response.statusCode).toBe(200); 
  expect(response.body.nickname).toBe("Faker");
});

test("Q4. POST /api/gamers vazio deve falhar (Erro 500)", async () => {
  const response = await request(app)
                        .post("/api/gamers")
                        .send({});  
  
  expect(response.statusCode).toBe(500);
});

test("Q5. POST /api/gamers deve retornar objeto com id, nickname e email", async () => {
  const emailDinamico = `fallen-${Date.now()}@email.com`;

  const response = await request(app)
                        .post("/api/gamers")
                        .send({
                            nickname: "FalleN",
                            email: emailDinamico
                        });
    
  expect(response.body).toHaveProperty("id");
  expect(response.body).toHaveProperty("nickname");
  expect(response.body).toHaveProperty("email");
});

test("Q6. POST /api/gamers deve bloquear emails duplicados", async () => {
  const emailAlvo = `email.unico-${Date.now()}@email.com`; 
  
  const payload = {
    nickname: "Jogador Duplicado",
    email: emailAlvo
  };
  
  await request(app).post("/api/gamers").send(payload);

  const response = await request(app).post("/api/gamers").send(payload);
  expect(response.statusCode).toBe(500);
});

test("Q7. DELETE /api/gamers/:id deve deletar e retornar status 204", async () => {
  const novoGamer = await request(app)
                          .post("/api/gamers")
                          .send({
                              nickname: "AlvoDelete",
                              email: `delete-${Date.now()}@email.com`
                          });

  const id = novoGamer.body.id;

  const response = await request(app).delete(`/api/gamers/${id}`);
  expect(response.statusCode).toBe(204);
});

test("Q8. Após DELETE, gamer não deve aparecer na listagem geral", async () => {
  const novoGamer = await request(app).post("/api/gamers").send({
    nickname: "Fantasma",
    email: `fantasma-${Date.now()}@email.com`
  });
  const id = novoGamer.body.id;

  await request(app).delete(`/api/gamers/${id}`);

  const response = await request(app).get("/api/gamers");
  const gamerEncontrado = response.body.find(gamer => gamer.id === id);

  expect(gamerEncontrado).toBeUndefined();
});

test("Q9. Fluxo E2E: Criar, Checar Existência, Deletar e Checar Ausência", async () => {
  const payload = { nickname: "E2ETester", email: `e2e-${Date.now()}@email.com` };
  
  const postRes = await request(app).post("/api/gamers").send(payload);
  expect(postRes.statusCode).toBe(200);
  const id = postRes.body.id;

  let getRes = await request(app).get("/api/gamers");
  let existe = getRes.body.some(gamer => gamer.id === id);
  expect(existe).toBe(true);

  const delRes = await request(app).delete(`/api/gamers/${id}`);
  expect(delRes.statusCode).toBe(204);

  getRes = await request(app).get("/api/gamers");
  existe = getRes.body.some(gamer => gamer.id === id);
  expect(existe).toBe(false);
});

afterAll(async () => {
  await pool.end(); 
});