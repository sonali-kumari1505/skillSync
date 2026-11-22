const express = require('express');
const { getRecommendations, compareWithUser } = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getRecommendations);
router.get('/compare/:userId', compareWithUser);

module.exports = router;
