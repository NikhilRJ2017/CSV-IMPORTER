const express = require('express');
const router = express.Router();
const { fileUpload } = require('../controller/api/v1/file_upload_controller');

router.route('/').post(fileUpload);

module.exports = router;