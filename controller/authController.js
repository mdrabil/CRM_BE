
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel.js';


// ✅ Register
export const register = async (req, res) => {
  const { name, email,role } = req.body;

  const userExists = await UserModel.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'User already exists' });


  const password = "rabil"

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

  const user = await UserModel.findOne({ email }).populate('role');
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch =  bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user._id,role:user?.role }, process.env.SECRET_KEY, { expiresIn: '7d' });
  console.log('j0 user login hua uska data ',user)
  res.status(200).json({ token, user });
}


// Update password directly using email (no old password check)
export const updatePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // find user by email
    console.log('email',email)
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // hash new password
    // const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, 10);


    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
