const express = require('express');
const router = express.Router();
const { requestAdoption, getRequestsForOwner, approveAdoption, rejectAdoption, getMyAdoptionRequests, cancelAdoption } = require('../controllers/adoption');
const { authCheck } = require('../middlewares/authCheck');


// =====================================
// 1) Request adoption (User ⇢ Owner)
// =====================================
router.post('/adoption/request', authCheck, requestAdoption);

// =====================================
// 2) Get adoption requests for cat owner
// =====================================
router.get('/adoption/owner/requests', authCheck, getRequestsForOwner);

// =====================================
// 3) Approve request (Owner only)
// =====================================
router.patch('/adoption/:id/approve', authCheck, approveAdoption);

// =====================================
// 4) Reject request (Owner only)
// =====================================
router.patch('/adoption/:id/reject', authCheck, rejectAdoption);

// =====================================
// 5) Get adoption requests that user created
// =====================================
router.get('/adoption/myrequests', authCheck, getMyAdoptionRequests);

router.post('/adoption/:id/cancel', authCheck, cancelAdoption);

module.exports = router;
