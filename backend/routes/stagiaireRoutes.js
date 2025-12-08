const express = require('express');
const router = express.Router();
//Router in Express allows you to group routes in separate files.



const { getAllStagiaires, getStagiaireById,
     deleteStagiaire, createStagiaire,
      updateStagiaire  } = require('../controllers/stagiaireController');


router.get('/', getAllStagiaires);
router.get('/:id', getStagiaireById);   
router.post('/', createStagiaire);
router.put('/:id', updateStagiaire);
router.delete('/:id', deleteStagiaire);


module.exports = router;