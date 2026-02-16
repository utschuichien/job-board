import express from 'express';
import { getCompanyProfile, getMyApplications, getSavedJobs, toggleSaveJob, updateProfile } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();
router.get('/my-applications', protect, getMyApplications);
router.post('/saved-jobs/:id', protect, toggleSaveJob);
router.get('/saved-jobs', protect, getSavedJobs);
router.get('/companies/:id', getCompanyProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

export default router;
