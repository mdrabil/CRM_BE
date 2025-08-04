import express from 'express'
import { assignRoleAndPermissions, createRole, deleteRole, getAllRoles, getRoleById, updateRole } from '../controller/CreateRole.js';
import { authMiddleware, authorize } from '../middleware/auth.js';
// import { authMiddleware, authorize } from '../middleware/auth.js';

const router = express.Router()

// router.post('/register', authMiddleware, authorize('create'), register);
// router.post('/', CreateAdmin);
router.post('/roles', createRole);

router.get("/getall", getAllRoles);
router.get("/getone/:id", getRoleById);
router.put("/update/:id", updateRole);
router.delete("/delete/:id",deleteRole);
// router.post('/assign-role',authMiddleware,authorize('role','create'), assignRoleAndPermissions);


assignRoleAndPermissions
// router.post('/login', login);








export default router