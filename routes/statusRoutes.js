const express = require('express');
const router = express.Router();

const {
  statusController: {
    getAllStatus,
    getOneStatus,
    createStatus,
    updateStatus,
    deleteStatus
  }
} = require('../controllers');

router.route('/').get(getAllStatus).post(createStatus);

router.route('/:id').get(getOneStatus).patch(updateStatus).delete(deleteStatus);

module.exports = router;
