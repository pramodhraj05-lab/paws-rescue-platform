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
  it("GET /animals without auth is rejected", async () => {
    const res = await request(app).get("/animals");
    expect([401, 403]).toContain(res.status);
  });

  it("GET /animals with valid token returns 200 or 403", async () => {
    const token = await getToken();
    const res = await request(app)
      .get("/animals")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 403]).toContain(res.status);
  });

  it("POST /animals without auth is rejected", async () => {
    const res = await request(app).post("/animals").send({
      name: "Rex",
      species: "Dog",
    });
    expect([401, 403]).toContain(res.status);
  });
});

describe("Shelters routes", () => {
  it("GET /shelters with valid token returns 200 or 403", async () => {
    const token = await getToken();
    const res = await request(app)
      .get("/shelters")
      .set("Authorization", `Bearer ${token}`);
    expect([200, 403]).toContain(res.status);
  });

  it("POST /shelters without auth is rejected", async () => {
    const res = await request(app).post("/shelters").send({
      name: "Test Shelter",
      location: "Dublin",
    });
    expect([401, 403]).toContain(res.status);
  });
});