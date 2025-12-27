const express = require('express');
const router = express.Router();


const {
     updateUserPassword , getUserByEmailPwd , sendEmailToUser
} =  require('../controllers/usersController') ;

router.put('/:id' , updateUserPassword ) ;
router.post('/' , getUserByEmailPwd) ;
router.post('/sendEmail' , sendEmailToUser) ;

module.exports = router ;