const express = require('express');
const router = express.Router();


const {
     updateUserPassword , getUserByEmailPwd , sendEmailToUser , checkCodeEmail , changeUserPassword
} =  require('../controllers/usersController') ;

router.put('/:id' , updateUserPassword ) ;
router.post('/' , getUserByEmailPwd) ;
router.post('/sendEmail' , sendEmailToUser) ;
router.post('/checkCodeEmail' , checkCodeEmail) ;
router.post('/changeUserPassword' , changeUserPassword) ;

module.exports = router ;