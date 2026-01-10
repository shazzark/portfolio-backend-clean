const express = require('express');
const skillController = require('../controllers/skillController');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
// PUBLIC ROUTES
router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkill);

// PROTECTED ROUTES (Admin only via secret header)
router.use(adminAuth);
router.post('/', skillController.createSkill);
router.patch('/:id', skillController.updateSkill);
router.delete('/:id', skillController.deleteSkill);
// router.patch('/reorder', skillController.reorderSkills);

module.exports = router;
