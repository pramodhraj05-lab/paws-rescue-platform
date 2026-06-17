const request = require("supertest");
const app = require("../app");
const { setupTestDB, teardownTestDB, clearTestDB } = require("./setup");

beforeAll(async () => { await setupTestDB(); });
afterAll(async () => { await teardownTestDB(); });
afterEach(async () => { await clearTestDB(); });

describe("Auth routes", () => {
  const validUser = {
    name: "Test User",
    email: "test@example.com",
    password: "testpass123",
  };

  it("POST /auth/register creates a new user", async () => {
    const res = await request(app).post("/auth/register").send(validUser);
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("token");
  });

  it("POST /auth/register rejects invalid email", async () => {
    const res = await request(app).post("/auth/register").send({
      ...validUser,
      email: "not-an-email",
    });
    expect(res.status).toBe(400);
  });

  it("POST /auth/register rejects duplicate email", async () => {
    await request(app).post("/auth/register").send(validUser);
    const res = await request(app).post("/auth/register").send(validUser);
    expect([400, 409]).toContain(res.status);
  });

  it("POST /auth/login succeeds with correct credentials", async () => {
    await request(app).post("/auth/register").send(validUser);
    const res = await request(app).post("/auth/login").send({
      email: validUser.email,
      password: validUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("POST /auth/login fails with wrong password", async () => {
    await request(app).post("/auth/register").send(validUser);
    const res = await request(app).post("/auth/login").send({
      email: validUser.email,
      password: "wrongpassword",
    });
    expect([400, 401]).toContain(res.status);
  });
});