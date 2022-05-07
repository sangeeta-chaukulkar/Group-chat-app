const path = require('path');

const express = require('express');

const userController = require('../controller/user');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.post('/message', authMiddleware.authenticate,userController.messages);

router.get('/getMessages/:lastmsgid', userController.getMessages);

router.get('/getUser/:id', userController.getUser);

router.get('/authenticateid',authMiddleware.authenticateid);



module.exports = router;