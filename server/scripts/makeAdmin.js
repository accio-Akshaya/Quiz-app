import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2];

const run = async () => {
  try {
    if (!email) {
      console.log('Usage: npm run make-admin -- user@example.com');
      process.exit(1);
    }

    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log('User not found');
    } else {
      console.log(`User ${user.email} is now an admin`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

run();
