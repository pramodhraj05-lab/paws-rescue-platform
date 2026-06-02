require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Shelter = require("./models/Shelter");
const Animal = require("./models/Animal");

const shelters = [
  { name: "Paws Dublin Centre", location: "Dublin, Ireland", phone: "01 497 7874", email: "dublin@paws.ie", capacity: 60, latitude: 53.3498, longitude: -6.2603 },
  { name: "Paws Cork Shelter", location: "Cork, Ireland", phone: "021 497 1200", email: "cork@paws.ie", capacity: 40, latitude: 51.8985, longitude: -8.4756 },
  { name: "Paws Galway Branch", location: "Galway, Ireland", phone: "091 777 400", email: "galway@paws.ie", capacity: 35, latitude: 53.2707, longitude: -9.0568 },
  { name: "Paws Limerick Centre", location: "Limerick, Ireland", phone: "061 312 434", email: "limerick@paws.ie", capacity: 30, latitude: 52.6638, longitude: -8.6267 },
];

const dogImages = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400",
  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
  "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400",
];

const catImages = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
  "https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400",
  "https://images.unsplash.com/photo-1495360010541-f48722b35f7d?w=400",
  "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400",
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    await User.deleteMany({});
    await Shelter.deleteMany({});
    await Animal.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Admin user
    const adminHash = await bcrypt.hash("admin123", 10);
    await User.create({ name: "Admin", email: "admin@paws.ie", password: adminHash, role: "admin" });
    console.log("👤 Admin created: admin@paws.ie / admin123");

    // Shelters
    const createdShelters = await Shelter.insertMany(shelters);
    console.log(`🏠 Seeded ${createdShelters.length} shelters`);

    // Animals
    const animals = [
      { name: "Buddy", species: "Dog", breed: "Labrador", age: 3, gender: "Male", status: "Available", image: dogImages[0], notes: "Friendly with kids", shelter: createdShelters[0]._id },
      { name: "Max", species: "Dog", breed: "German Shepherd", age: 5, gender: "Male", status: "Available", image: dogImages[1], notes: "Loyal and intelligent", shelter: createdShelters[0]._id },
      { name: "Bella", species: "Dog", breed: "Golden Retriever", age: 2, gender: "Female", status: "Available", image: dogImages[2], notes: "Perfect family dog", shelter: createdShelters[1]._id },
      { name: "Luna", species: "Dog", breed: "Border Collie", age: 1, gender: "Female", status: "Available", image: dogImages[3], notes: "Smart and energetic", shelter: createdShelters[1]._id },
      { name: "Rocky", species: "Dog", breed: "Bulldog", age: 6, gender: "Male", status: "Medical Hold", image: dogImages[4], notes: "Recovering from surgery", shelter: createdShelters[2]._id },
      { name: "Whiskers", species: "Cat", breed: "Domestic Shorthair", age: 4, gender: "Male", status: "Available", image: catImages[0], notes: "Independent and curious", shelter: createdShelters[0]._id },
      { name: "Mittens", species: "Cat", breed: "Ragdoll", age: 2, gender: "Female", status: "Available", image: catImages[1], notes: "Affectionate cat", shelter: createdShelters[1]._id },
      { name: "Shadow", species: "Cat", breed: "British Shorthair", age: 6, gender: "Male", status: "Available", image: catImages[2], notes: "Prefers quiet homes", shelter: createdShelters[2]._id },
      { name: "Simba", species: "Cat", breed: "Maine Coon", age: 5, gender: "Male", status: "Available", image: catImages[3], notes: "Large and fluffy", shelter: createdShelters[3]._id },
    ];
    await Animal.insertMany(animals);
    console.log(`🐾 Seeded ${animals.length} animals`);

    console.log("✅ Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();