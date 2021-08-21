const express = require('express');
const router = express.Router();

const {
  commentController: {
    getAllComment,
    getOneComment,
    createComment,
    updateComment,
    deleteComment
  },
  authController: { protect, restrictTo }
} = require('../controllers');

router.use(protect).route('/').get(getAllComment).post(createComment);

router
  .use(protect)
  .route('/:id')
  .get(getOneComment)
  .patch(updateComment)
  .delete(deleteComment);

module.exports = router;
