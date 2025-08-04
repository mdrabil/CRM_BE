
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js';
import Role from '../models/Role.js';



export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserModel.findById(decoded.id).populate('role');
    if (!user) return res.status(401).json({ message: 'Invalid user' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};



// export const authorize = (moduleName, action) => {
//   return async (req, res, next) => {
//     const user = await UserModel.findById(req.user.id).populate('role');
//     const permissions = user.role?.permissions?.get(moduleName);

//     if (permissions && permissions.includes(action)) {
//       return next();
//     }

//     return res.status(403).json({ error: 'Access Denied' });
//   };
// };

export const authorize = (moduleName, action) => {
  return async (req, res, next) => {
    try {
      const user = await UserModel.findById(req.user.id).populate('role');

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized user' });
      }

       if (user.role?.name === 'admin') {
        return next();
      }
      // 1. ✅ Check user-level custom permissions first
      const custom = user.customPermissions?.get(moduleName);
      if (custom && custom.includes(action)) {
        return next();
      }

      // 2. ✅ Check role-level default permissions
      const rolePermissions = user.role?.permissions?.get(moduleName);
      if (rolePermissions && rolePermissions.includes(action)) {
        return next();
      }

      return res.status(403).json({ error: 'Access Denied' });
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Server Error' });
    }
  };
};
