const request = require("supertest");
const app = require("../app");
const { setupTestDB, teardownTestDB } = require("./setup");

beforeAll(async () => { await setupTestDB(); });
afterAll(async () => { await teardownTestDB(); });

describe("Health endpoint", () => {
  it("GET / returns status OK", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("OK");
    expect(res.body.message).toMatch(/Paws Rescue/i);
  });

  it("GET /unknown returns 404", async () => {
    const res = await request(app).get("/this-does-not-exist");
    expect(res.status).toBe(404);
  });
});