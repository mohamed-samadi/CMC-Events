const express = require('express');
const router = express.Router();

const {
    getAllPoles,
    getPoleById,
    deletePole,
    createPole,
    updatePole
}= require('../controllers/polesController');

router.get('/', getAllPoles);
router.get('/:id', getPoleById);
router.post('/', createPole);
router.put('/:id', updatePole);
router.delete('/:id', deletePole);

module.exports = router;