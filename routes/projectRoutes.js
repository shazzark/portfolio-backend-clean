const express = require('express');
const projectController = require('../controllers/projectControllers');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
// PUBLIC ROUTES
router.get('/', projectController.getAllProjects);
router.get('/:identifier', projectController.getProject);

// PROTECTED ROUTES (Admin only via secret header)
router.use(adminAuth); // Apply to all routes below
router.post('/', projectController.createProject);
router.patch('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
