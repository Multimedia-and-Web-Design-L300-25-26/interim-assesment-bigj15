const Crypto = require("../models/Crypto");

// @desc    Get all cryptocurrencies
// @route   GET /api/crypto
// @access  Public
const getAllCrypto = async (req, res) => {
  try {
    const cryptos = await Crypto.find().sort({ price: -1 });
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Get top gainers (highest 24h change)
// @route   GET /api/crypto/gainers
// @access  Public
const getTopGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find({ change24h: { $gt: 0 } }).sort({
      change24h: -1,
    });
    res.json(gainers);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Get new listings (most recently added)
// @route   GET /api/crypto/new
// @access  Public
const getNewListings = async (req, res) => {
  try {
    const newCryptos = await Crypto.find().sort({ createdAt: -1 });
    res.json(newCryptos);
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// @desc    Add a new cryptocurrency
// @route   POST /api/crypto
// @access  Public
const addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;

    // Validate input
    if (!name || !symbol || price == null || !image || change24h == null) {
      return res.status(400).json({
        message:
          "Please provide all fields: name, symbol, price, image, change24h",
      });
    }

    const crypto = await Crypto.create({ name, symbol, price, image, change24h });

    res.status(201).json({
      message: "Cryptocurrency added successfully",
      crypto,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = { getAllCrypto, getTopGainers, getNewListings, addCrypto };
