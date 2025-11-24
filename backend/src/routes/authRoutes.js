const express = require('express');
const router = express.Router();
const { googleLogin, adminLogin } = require('../controllers/authController');

router.post('/google', googleLogin);
router.post('/admin', adminLogin);

module.exports = router;

