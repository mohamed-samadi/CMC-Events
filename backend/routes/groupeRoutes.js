const express = require('express');
const router = express.Router();

const {
    getAllGroupes,
    getGroupeById,
    deleteGroupe,
    createGroupe,
    updateGroupe
}= require('../controllers/groupeController');

router.get('/', getAllGroupes);
router.get('/:id', getGroupeById);
router.post('/', createGroupe);
router.put('/:id', updateGroupe);
router.delete('/:id', deleteGroupe);

module.exports = router;