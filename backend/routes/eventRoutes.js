const express = require('express');
const router = express.Router();

const {
    getAllevents
    // deleteEvent
    // createEvent,
    // getEventById
}= require('../controllers/eventController');

router.get('/', getAllevents);
module.exports = router;