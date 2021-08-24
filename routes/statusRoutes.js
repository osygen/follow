const express = require('express');
const router = express.Router();

const {
  statusController: {
    getAllStatus,
    getOneStatus,
    createStatus,
    updateStatus,
    deleteStatus
  },
  authController: { protect, restrictTo },
  factory: { setReqBodyUser }
} = require('../controllers');

router
  .use(protect)
  .route('/')
  .get(getAllStatus)
  .post(setReqBodyUser, createStatus);

router
  .use(protect)
  .route('/:id')
  .get(getOneStatus)
  .patch(updateStatus)
  .delete(deleteStatus);

module.exports = router;
