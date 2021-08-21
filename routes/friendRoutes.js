const express = require('express');
const {
  friendController: {
    getAllFriend,
    getOneFriend,
    friendRequest,
    createFriend,
    checkCreateFriend,
    updateFriend,
    deleteFriend
  },
  authController: { protect, restrictTo }
} = require('../controllers');

const router = express.Router();

router.use(protect).route('/').get(getAllFriend).post(createFriend);

router
  .use(protect)
  .route('/:id')
  .get(getOneFriend)
  .patch(updateFriend)
  .delete(deleteFriend);

router
  .use(protect)
  .route('/:addUser?/req')
  .post(checkCreateFriend, friendRequest);

module.exports = router;
