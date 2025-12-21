import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DOMAIN = '@adypu.edu.in'; // enforce domain

const register = async (req, res) => {
  try {
    const { name, email, password, role, vendorType } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email and password required' });
    }

    // server-side domain restriction
    if (role !== 'vendor' && !email.toLowerCase().endsWith(DOMAIN)) {
      return res.status(400).json({ message: `Use college email!` });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'student',
      vendorType: role === 'vendor' ? vendorType : undefined
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role, vendorType: user.vendorType }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please login to continue.',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, vendorType: user.vendorType }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role, vendorType: user.vendorType }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, vendorType: user.vendorType }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export { register, login };
