const express = require('express');
const router = express.Router();

const admin = require('../controllers/adminControllers')

router.get('/:adminId/user-list', admin.getUserAll)
router.post('/', admin.createAdmin)

router.delete('/:adminId', admin.deleteUser)




module.exports = router