const express = require('express');
const {
  getPlatformStats,
  getAllUsers,
  toggleUserSuspension,
  createReport,
  getReports,
  updateReportStatus
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.use(protect);

// Report creation is accessible to all logged-in students
router.post('/reports', createReport);

// All other endpoints require Admin role
router.use(authorize('admin'));

router.get('/stats', getPlatformStats);
router.get('/users', getAllUsers);
router.put('/users/:id/suspend', toggleUserSuspension);
router.get('/reports', getReports);
router.put('/reports/:id', updateReportStatus);

module.exports = router;
