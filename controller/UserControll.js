import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

// REGISTER
// export const register = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

//     const { name, email, password, role } = req.body;

//     const userExists = await UserModel.findOne({ email });
//     if (userExists) return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new UserModel({
//       name,
//       email,
//       password: hashedPassword,
//       role
//     });

//     await newUser.save();

//     const token = jwt.sign(
//       { id: newUser._id, role: newUser.role },
//       process.env.SECRET_KEY,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({ token, user: newUser });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().populate('role');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ONE USER
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await UserModel.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json({ message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FORGOT PASSWORD (send email with reset token)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '15m' });
    // Here you’d send email to the user with reset link (example below)
    // sendEmail(user.email, `Reset your password: ${process.env.CLIENT_URL}/reset/${resetToken}`);

    res.json({ message: 'Password reset link sent to email', resetToken }); // Remove token in production
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await UserModel.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
