import express from 'express';
import { protect, authorize } from '../middlewares/auth.middleware.js';
import {
    getStats,
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJobAny,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJobAny);

export default router;
