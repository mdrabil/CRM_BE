// const CreateAdmin = async ()=>{
//     const
// }

import Role from "../models/Role.js";
import UserModel from "../models/UserModel.js";


// POST /api/roles
// export const createRole = async (req, res) => {
   
//   try {
//     const { name, permissions ,status } = req.body;

//     // check if role already exists
//     const existing = await Role.findOne({ name });
//     if (existing) {
//       return res.status(400).json({ message: "Role already exists" });
//     }

//     const newRole = new Role({ name, permissions,status:status });
//     await newRole.save();

//     res.status(201).json({ message: "Role created", role: newRole });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


export const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Role ke basis par default URLs
    let urls = [];
    switch(name) {
      case "Medicine_Dispenser":
        urls = ["checked_by_doctor"];
        break;
      case "Medicine_Explainer":
        urls = ["medicines_dispensed"];
        break;
      case "Receptionist":
        urls = ["pending",'completed'];
        break;
      default:
        urls = ["dashboard"];
    }

    const role = new Role({
      name,
      permissions,
      urls
    });

    await role.save();
    res.status(201).json({ message: "Role created successfully", role });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Role ke basis par URLs set karna
    let urls = [];
    switch(name) {
      case "Medicine_Dispenser":
        urls = ["checked_by_doctor"];
        break;
      case "Medicine_Explainer":
        urls = ["medicines_dispensed"];
        break;
      case "Receptionist":
        urls = ["dashboard"];
        break;
              case "Medical_Stock_Incharge":
        urls = ["medicines"];
        break;
      default:
        urls = ["dashboard"];
    }

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions, urls }, // ✅ urls update
      { new: true }
    );

    if (!role) return res.status(404).json({ message: "Role not found" });

    res.status(200).json({ message: "Role updated successfully", role });
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