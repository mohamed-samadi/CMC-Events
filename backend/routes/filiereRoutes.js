const express = require('express');
const router = express.Router();

const {
    getAllFiliere,
    deleteFiliere,
    createFiliere,
    getFiliereById,
    updateFiliere
}= require('../controllers/filiereController');

router.get('/', getAllFiliere);
router.get('/:id', getFiliereById);
router.post('/', createFiliere);
router.put('/:id', updateFiliere);
router.delete('/:id', deleteFiliere);


module.exports = router;