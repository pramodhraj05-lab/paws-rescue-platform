const request = require("supertest");
const app = require("../app");
const { setupTestDB, teardownTestDB, clearTestDB } = require("./setup");

beforeAll(async () => { await setupTestDB(); });
afterAll(async () => { await teardownTestDB(); });
afterEach(async () => { await clearTestDB(); });

async function getToken() {
  const res = await request(app).post("/auth/register").send({
    name: "Test User",
    email: `u_${Date.now()}@test.com`,
    password: "testpass123",
  });
  return res.body.token;
}

describe("Animals routes", () => {
  it("GET /animals without auth returns 401", async () => {
    const res = await request(app).get("/animals");
    expect([401, 403]).toContain(res.status);
  });

  it("GET /animals with auth returns array", async () => {
    const token = await getToken();
    const res = await request(app)
      .get("/animals")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /animals without auth returns 401", async () => {
    const res = await request(app).post("/animals").send({
      name: "Rex",
      species: "Dog",
    });
    expect([401, 403]).toContain(res.status);
  });
});

describe("Shelters routes", () => {
  it("GET /shelters with auth returns array", async () => {
    const token = await getToken();
    const res = await request(app)
      .get("/shelters")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /shelters without auth returns 401", async () => {
    const res = await request(app).post("/shelters").send({
      name: "Test Shelter",
      location: "Dublin",
    });
    expect([401, 403]).toContain(res.status);
  });
});