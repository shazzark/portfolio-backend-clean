const express = require('express');
const adminAuth = require('../middleware/adminAuth');
const controller = require('../controllers/adminAuthController');

const router = express.Router();
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.get('/session', adminAuth, controller.session);
module.exports = router;
