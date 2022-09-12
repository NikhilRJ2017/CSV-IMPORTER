const express = require('express');
const router = express.Router();

const fileUploadRoute = require('./file_upload_route');
const userRoute = require('./user_route');
const userAccountRoute = require('./user_account_route');
const policyRoute = require('./policy_route');

router.use('/upload', fileUploadRoute);
router.use('/user', userRoute);
router.use('/useraccount', userAccountRoute);
router.use('/policy', policyRoute);


module.exports = router;