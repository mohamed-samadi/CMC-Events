const express = require('express');
const router = express.Router();


const {
     updateUserPassword , getUserByEmailPwd
} =  require('../controllers/usersController') ;

router.put('/:id' , updateUserPassword ) ;
router.post('/' , getUserByEmailPwd) ;

module.exports = router ;