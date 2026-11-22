const express = require('express');
const {
  sendRequest,
  getMyRequests,
  getRequestById,
  updateRequestStatus
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', sendRequest);
router.get('/', getMyRequests);
router.get('/:id', getRequestById);
router.put('/:id/status', updateRequestStatus);

module.exports = router;
