const express = require('express');
const router = express.Router();
//Router in Express allows  to group routes in separate files.
const  {
    getAllFormateurs,
    getFormateurById,
    deleteFormateur,
    createFormateur,
    updateFormateur
} = require('../controllers/formateurController');


router.get('/', getAllFormateurs);
router.get('/:id', getFormateurById);   
router.post('/', createFormateur);
router.put('/:id', updateFormateur);
router.delete('/:id', deleteFormateur);

module.exports = router;