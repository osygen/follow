const express = require('express');
const {
  userController: {
    getOneUser,
    getAllUser,
    createUser,
    updateUser,
    deleteUser
  },
  authController: {
    signupUser,
    checkSignup,
    createTokenRes,
    checkLogin,
    loginUser,
    logout,
    protect,
    restrictTo
  }
} = require('../controllers');

const router = express.Router();

router.route('/signup').post(checkSignup, signupUser, createTokenRes);
router.route('/login').post(checkLogin, loginUser, createTokenRes);
router.route('/logout').get(logout);

router.use(protect).route('/').get(getAllUser).post(createUser);

router
  .use(protect)
  .route('/:id')
  .get(getOneUser)
  .patch(updateUser)
  .delete(restrictTo('admin'), deleteUser);

module.exports = router;
