const express = require('express');
const router = express.Router();


const {
     updateUserPassword
} =  require('../controllers/usersController') ;

router.put('/:id' , updateUserPassword ) ;

module.exports = router ;