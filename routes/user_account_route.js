const express = require('express');
const { createUserAccount, getUserAccount, deleteUserAccount, updateUserAccount, getAllUserAccount } = require('../controller/api/v1/user_account_controller');
const router = express.Router();

router.route('/getAllUserAccount').get(getAllUserAccount);
router.route('/getUserAccount/:id').get(getUserAccount);
router.route('/createUserAccount').post(createUserAccount);
router.route('/deleteUserAccount/:id').delete(deleteUserAccount);
router.route('/updateUserAccount/:id').patch(updateUserAccount);

module.exports = router;