require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function main() {
  const [,, email, password, name] = process.argv;
  if (!email || !password) {
    console.log('Usage: node seedUser.js <email> <password> [name]');
    process.exit(1);
  }

  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nextgen';
  await mongoose.connect(MONGO_URI);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User already exists:', email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ name: name || 'Admin', email, password: hash });
  await user.save();
  console.log('User created:', email);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
