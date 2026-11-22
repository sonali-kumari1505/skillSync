const express = require('express');
const {
  getMyProfile,
  updateMyProfile,
  getProfileById,
  addTeachSkill,
  removeTeachSkill,
  addLearnSkill,
  removeLearnSkill,
  exploreProfiles
} = require('../controllers/profileController');
const { protect, optionalProtect } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalProtect, exploreProfiles);
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/:userId', getProfileById);

router.post('/skills/teach', protect, addTeachSkill);
router.delete('/skills/teach/:skillName', protect, removeTeachSkill);

router.post('/skills/learn', protect, addLearnSkill);
router.delete('/skills/learn/:skillName', protect, removeLearnSkill);

module.exports = router;
