const express = require('express');
const router = express.Router();
const { googleLogin, adminLogin, emailPasswordLogin } = require('../controllers/authController');

router.post('/google', googleLogin);
router.post('/admin', adminLogin);
router.post('/email', emailPasswordLogin);

module.exports = router;

