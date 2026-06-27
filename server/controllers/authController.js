import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});


// ================= REGISTER =================
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const isSuperAdmin =
      email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL;

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      role: isSuperAdmin ? "admin" : "user"
    });

    const token = signToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'Use Google login for this account.' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};


// ================= GOOGLE LOGIN =================
export const googleLogin = async (req, res) => {
  try {
    console.log("========== GOOGLE LOGIN ==========");
    console.log("BODY:", req.body);
    console.log("GOOGLE CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Google token missing"
      });
    }

    console.log("TOKEN RECEIVED");

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    console.log("TOKEN VERIFIED SUCCESSFULLY");

    const payload = ticket.getPayload();

    console.log("GOOGLE PAYLOAD:", payload);

    const {
      sub,
      email,
      name,
      email_verified
    } = payload;

    if (!email_verified) {
      return res.status(400).json({
        message: "Google email is not verified"
      });
    }

    let user = await User.findOne({
      email: email.toLowerCase()
    });

    console.log("USER FOUND:", user ? "YES" : "NO");

    const isSuperAdmin =
      email.toLowerCase() === process.env.SUPER_ADMIN_EMAIL;

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email: email.toLowerCase(),
        googleId: sub,
        role: isSuperAdmin ? "admin" : "user"
      });

      console.log("NEW USER CREATED");
    }

    const jwtToken = signToken(user);

    return res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: sanitizeUser(user)
    });

  } catch (error) {
    console.log("========== GOOGLE ERROR ==========");
    console.log("MESSAGE:", error.message);
    console.log("STACK:", error);

    return res.status(401).json({
      message: "Google authentication failed",
      error: error.message
    });
  }
};


// ================= GET USERS (ADMIN ONLY) =================
export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};


// ================= MAKE ADMIN =================
export const makeAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { userId } = req.params;

    if (req.user.id === userId) {
      return res.status(400).json({ message: "You can't change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User promoted to admin',
      user: sanitizeUser(user)
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to update role' });
  }
};