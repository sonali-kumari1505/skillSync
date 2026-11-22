const express = require('express');
const {
  getMyProgress,
  getProgressByExchange,
  addMilestone,
  toggleMilestone,
  addNote
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', getMyProgress);
router.get('/exchange/:exchangeId', getProgressByExchange);
router.post('/:id/milestones', addMilestone);
router.put('/:id/milestones/:milestoneId', toggleMilestone);
router.post('/:id/notes', addNote);

module.exports = router;
