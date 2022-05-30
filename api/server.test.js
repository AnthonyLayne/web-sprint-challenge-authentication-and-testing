// Write your tests here
const request = require("supertest");

const db = require("../data/dbConfig");
const server = require("./server");

const createUserAndGetJwt = async () => {
  await request(server).post("/api/auth/register").send({
    username: "user",
    password: "pass",
  });

  const {
    body: { token },
  } = await request(server).post("/api/auth/login").send({
    username: "user",
    password: "pass",
  });

  return token;
};

test("sanity", () => {
  expect(true).toBe(true);
});

test("check environment", () => {
  expect(process.env.NODE_ENV).toBe("testing");
});

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
});

afterAll(async () => {
  await db.destroy();
});

describe("POST /api/auth/register", () => {
  test("handles missing password", async () => {
    const response = await request(server).post("/api/auth/register").send({
      username: "user",
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("username and password required");
  });

  test("registers new user", async () => {
    const response = await request(server).post("/api/auth/register").send({
      username: "user",
      password: "pass",
    });
    expect(response.status).toBe(201);
  });
});

describe("POST /api/auth/login", () => {
  test("handles missing password", async () => {
    const response = await request(server).post("/api/auth/login").send({
      username: "user",
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("username and password required");
  });

  test("logs in new user", async () => {
    await request(server).post("/api/auth/register").send({
      username: "user",
      password: "pass",
    });

    const loginResponse = await request(server).post("/api/auth/login").send({
      username: "user",
      password: "pass",
    });

    expect(loginResponse.status).toBe(200);
  });
});

describe("GET /api/jokes", () => {
  test("returns the correct status code", async () => {
    const token = await createUserAndGetJwt();
    console.log("2", token);

    const response = await request(server).get("/api/jokes").set("authorization", token);
    expect(response.status).toBe(200);
  });

  test("returns an array", async () => {
    const token = await createUserAndGetJwt();
    const response = await request(server).get("/api/jokes").set("authorization", token);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
