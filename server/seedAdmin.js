require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Admin = require("./models/admin.model");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "example@gmail.com";
  const existing = await Admin.findOne({ email });

  if (existing) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const password = await bcrypt.hash("Example@123", 10);

  await Admin.create({
    name: "Tim David",
    email,
    password,
    isActive: true
  });

  console.log("Admin created.");
  console.log("Email: example@gmail.com");
  console.log("Password: Example@123");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
