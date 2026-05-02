const request = require("supertest");
const app = require("../server");
const { connect, closeDatabase, clearDatabase } = require("./setup");
const User = require("../models/User");

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("Auth Endpoints", () => {
  describe("POST /api/register", () => {
    it("should register a new user successfully", async () => {
      const res = await request(app).post("/api/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body.name).toBe("Test User");
      expect(res.body.email).toBe("test@example.com");
    });

    it("should fail if email is already in use", async () => {
      // Create user first
      await User.create({
        name: "Existing",
        email: "exist@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/register").send({
        name: "Test User 2",
        email: "exist@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  describe("POST /api/login", () => {
    it("should login user with correct credentials", async () => {
      // Register
      await request(app).post("/api/register").send({
        name: "Test User",
        email: "testlogin@example.com",
        password: "password123",
      });

      // Login
      const res = await request(app).post("/api/login").send({
        email: "testlogin@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body.email).toBe("testlogin@example.com");
    });

    it("should reject invalid password", async () => {
       // Register
       await request(app).post("/api/register").send({
        name: "Test User",
        email: "testfail@example.com",
        password: "password123",
      });

      const res = await request(app).post("/api/login").send({
        email: "testfail@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(401);
    });
  });

  describe("GET /api/profile", () => {
    it("should access profile with valid token", async () => {
      const authRes = await request(app).post("/api/register").send({
        name: "Profile User",
        email: "profile@example.com",
        password: "password123",
      });

      const token = authRes.body.token;

      const res = await request(app)
        .get("/api/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.email).toBe("profile@example.com");
    });

    it("should deny access without token", async () => {
      const res = await request(app).get("/api/profile");
      expect(res.statusCode).toEqual(401);
    });
  });
});
