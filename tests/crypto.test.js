const request = require("supertest");
const app = require("../server");
const { connect, closeDatabase, clearDatabase } = require("./setup");
const Crypto = require("../models/Crypto");

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("Crypto Endpoints", () => {
  describe("POST /api/crypto", () => {
    it("should add a new cryptocurrency", async () => {
      const res = await request(app).post("/api/crypto").send({
        name: "Testcoin",
        symbol: "TST",
        price: 50.0,
        image: "https://example.com/tst.png",
        change24h: 5.5,
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body.crypto.name).toBe("Testcoin");
    });

    it("should fail if fields are missing", async () => {
      const res = await request(app).post("/api/crypto").send({
        name: "Badcoin",
        symbol: "BAD",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain("Please provide all fields");
    });
  });

  describe("GET /api/crypto filters", () => {
    beforeEach(async () => {
      await Crypto.create([
        { name: "Coin A", symbol: "CNA", price: 10, image: "a.png", change24h: -2.0, createdAt: new Date("2024-01-01") },
        { name: "Coin B", symbol: "CNB", price: 20, image: "b.png", change24h: 5.0, createdAt: new Date("2024-01-02") },
        { name: "Coin C", symbol: "CNC", price: 30, image: "c.png", change24h: 1.5, createdAt: new Date("2024-01-03") }
      ]);
    });

    it("GET /api/crypto should return all coins sorted by price desc", async () => {
      const res = await request(app).get("/api/crypto");
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].name).toBe("Coin C"); // highest price
    });

    it("GET /api/crypto/gainers should return positive change24h sorted desc", async () => {
      const res = await request(app).get("/api/crypto/gainers");
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(2);
      expect(res.body[0].name).toBe("Coin B"); // 5.0
      expect(res.body[1].name).toBe("Coin C"); // 1.5
    });

    it("GET /api/crypto/new should return newest first", async () => {
      const res = await request(app).get("/api/crypto/new");
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBe(3);
      expect(res.body[0].name).toBe("Coin C"); // 2024-01-03
    });
  });
});
