const express = require('express');
const { createUser, getUser, deleteUser, updateUser, getAllUser } = require('../controller/api/v1/user_controller');
const router = express.Router();

router.route('/getAllUser').get(getAllUser);
router.route('/getUser/:id').get(getUser);
router.route('/createUser').post(createUser);
router.route('/deleteUser/:id').delete(deleteUser);
router.route('/updateUser/:id').patch(updateUser);

module.exports = router;