const express = require('express');
const userController = require('../controllers/userControllers');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();
// PUBLIC ROUTE
router.get('/', userController.getProfile);

// PROTECTED ROUTE
router.patch('/profile', adminAuth, userController.updateProfile);

module.exports = router;
