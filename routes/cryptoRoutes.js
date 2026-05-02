const express = require("express");
const router = express.Router();
const {
  getAllCrypto,
  getTopGainers,
  getNewListings,
  addCrypto,
} = require("../controllers/cryptoController");

// GET /api/crypto — all cryptos
router.get("/", getAllCrypto);

// GET /api/crypto/gainers — top gainers
router.get("/gainers", getTopGainers);

// GET /api/crypto/new — new listings
router.get("/new", getNewListings);

// POST /api/crypto — add new crypto
router.post("/", addCrypto);

module.exports = router;
