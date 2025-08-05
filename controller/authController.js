import Role from '../models/Role.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel.js';


// ✅ Register
export const register = async (req, res) => {
  const { name, email, password,role } = req.body;

  const userExists = await UserModel.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);





  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    role: role,
  });

  await newUser.save();

  const token = jwt.sign({ id: newUser._id,role:newUser?.role }, process.env.SECRET_KEY, { expiresIn: '7d' });

  res.status(201).json({ token, user: newUser });
};

// ✅ Login
export const login = async (req, res) => {
  const { email, password } = req.body;
console.log('username',email)
  const user = await UserModel.findOne({ email }).populate('role');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id,role:user?.role }, process.env.SECRET_KEY, { expiresIn: '7d' });

  res.status(200).json({ token, user });
}
