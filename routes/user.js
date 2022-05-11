const path = require('path');

const express = require('express');

const userController = require('../controller/user');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


router.post('/signup', userController.signup);
router.post('/login', userController.login);

router.post('/message', authMiddleware.authenticate,userController.messages);

router.get('/getMessages/:lastmsgid', userController.getMessages);
router.get('/getGroupMessages/:groupid', userController.getGroupMessages);

router.get('/getUser/:id', userController.getUser);
router.get('/getGroup/:id', userController.getGroup);



router.get('/authenticateid',authMiddleware.authenticateid);

router.get('/getUsers', userController.getUsers);


router.post('/creategroup', authMiddleware.authenticate,userController.createGroup);

module.exports = router;