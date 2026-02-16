import express from 'express';
import { applyJob, createJob, deleteJob, getJobApplications, getJobById, getJobs, getJobsByEmployer, getMyJobs, updateApplicationStatus, updateJob } from '../controllers/job.controller.js';
import { authorize, protect } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';


const router = express.Router();

router.get('/my-jobs', protect, authorize('employer'), getMyJobs);
router.get('/', getJobs)
router.get('/:id', getJobById);
router.get('/:id/applications', protect, authorize('employer'), getJobApplications);
router.post('/', protect, authorize('employer'), createJob);
router.post('/:id/apply', protect, authorize('candidate'), upload.single('cv'), applyJob);
router.patch('/application/:id/status', protect, authorize('employer'), updateApplicationStatus);
router.put('/:id', protect, authorize('employer'), updateJob); 
router.get('/employer/:employerId', getJobsByEmployer);
router.delete('/:id', protect, authorize('employer'), deleteJob);
export default router;