const express = require('express');
const experienceController = require('../controllers/experienceController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
// PUBLIC ROUTES
router.get('/', experienceController.getAllExperiences);
router.get('/featured', experienceController.getFeaturedExperiences);
router.get('/:id', experienceController.getExperience);

// PROTECTED ROUTES (Admin only via secret header)
router.use(adminAuth);
router.post('/', experienceController.createExperience);
router.patch('/:id', experienceController.updateExperience);
router.delete('/:id', experienceController.deleteExperience);

module.exports = router;
