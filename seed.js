const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Crypto = require("./models/Crypto");

dotenv.config();

const cryptoSeeds = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 68250.12,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    change24h: 2.25,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 3540.78,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    change24h: 4.03,
  },
  {
    name: "Tether",
    symbol: "USDT",
    price: 1.0,
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    change24h: 0.0,
  },
  {
    name: "BNB",
    symbol: "BNB",
    price: 598.42,
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    change24h: 1.15,
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 156.33,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    change24h: 3.41,
  },
  {
    name: "XRP",
    symbol: "XRP",
    price: 0.63,
    image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    change24h: 1.56,
  },
  {
    name: "USDC",
    symbol: "USDC",
    price: 1.0,
    image: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
    change24h: 0.0,
  },
  {
    name: "Cardano",
    symbol: "ADA",
    price: 0.62,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    change24h: -1.78,
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    price: 0.16,
    image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    change24h: -1.28,
  },
  {
    name: "TRON",
    symbol: "TRX",
    price: 0.13,
    image: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
    change24h: 3.94,
  },
  {
    name: "Raydium",
    symbol: "RAY",
    price: 6.46,
    image: "https://assets.coingecko.com/coins/images/13928/large/PSigc4ie_400x400.jpg",
    change24h: 19.75,
  },
  {
    name: "Avalanche",
    symbol: "AVAX",
    price: 38.21,
    image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    change24h: 5.12,
  },
  {
    name: "Polkadot",
    symbol: "DOT",
    price: 7.45,
    image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    change24h: -0.85,
  },
  {
    name: "Chainlink",
    symbol: "LINK",
    price: 19.42,
    image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    change24h: 0.43,
  },
  {
    name: "Polygon",
    symbol: "MATIC",
    price: 0.72,
    image: "https://assets.coingecko.com/coins/images/4713/large/polygon.png",
    change24h: 2.87,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    // Clear existing data
    await Crypto.deleteMany({});
    console.log("Cleared existing crypto data.");

    // Insert seed data with staggered createdAt so "new listings" sort works
    for (let i = 0; i < cryptoSeeds.length; i++) {
      const crypto = new Crypto(cryptoSeeds[i]);
      // Stagger creation times so newest = last in array
      crypto.createdAt = new Date(Date.now() - (cryptoSeeds.length - i) * 60000);
      await crypto.save();
    }

    console.log(`Seeded ${cryptoSeeds.length} cryptocurrencies.`);
    process.exit(0);
  } catch (error) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
