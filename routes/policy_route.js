const express = require('express');
const { createPolicy, getPolicy, deletePolicy, updatePolicy, getAllPolicy } = require('../controller/api/v1/policy_controller');
const router = express.Router();

router.route('/getAllPolicy').get(getAllPolicy);
router.route('/getPolicy/:id').get(getPolicy);
router.route('/createPolicy').post(createPolicy);
router.route('/deletePolicy/:id').delete(deletePolicy);
router.route('/updatePolicy/:id').patch(updatePolicy);

module.exports = router;