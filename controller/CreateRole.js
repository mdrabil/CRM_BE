// const CreateAdmin = async ()=>{
//     const
// }

import Role from "../models/Role.js";
import UserModel from "../models/UserModel.js";


// POST /api/roles
export const createRole = async (req, res) => {
    console.log('rabil')
  try {
    const { name, permissions } = req.body;

    // check if role already exists
    const existing = await Role.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const newRole = new Role({ name, permissions });
    await newRole.save();

    res.status(201).json({ message: "Role created", role: newRole });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// READ All Roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// READ Single Role
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json(role);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE Role
export const updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true }
    );
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role updated", role });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE Role
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.status(200).json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// assing customPermissos 

export const assignRoleAndPermissions = async (req, res) => {
  const { userId, roleId, customPermissions } = req.body;

  const user = await UserModel.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.role = roleId;
  if (customPermissions) {
    user.customPermissions = customPermissions;
  }

  await user.save();

  res.status(200).json({ message: "Updated successfully", user });
};