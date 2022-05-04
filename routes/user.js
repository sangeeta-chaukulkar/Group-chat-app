const path = require('path');

const express = require('express');

const userController = require('../controller/user');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.post('/message', authMiddleware.authenticate,userController.messages);

router.get('/getUserMessages', authMiddleware.authenticate,userController.getUserMessages);



module.exports = router;