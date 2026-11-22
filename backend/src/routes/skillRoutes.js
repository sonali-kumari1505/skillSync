const express = require('express');
const { getSkills, createSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSkills);
router.post('/', protect, createSkill);

module.exports = router;
