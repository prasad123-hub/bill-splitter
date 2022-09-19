const express = require('express');
const controller = require("../controllers/userController");
const apiAuth = require("../helpers/apiAuthentication");

const router = express.Router()

// User Registration Route
router.route('/v1/register').post(controller.userReg)

// User Login Route
router.route('/v1/login').post(controller.userLogin)

// View User Details
router.route('/v1/profile').post(apiAuth.validateToken, controller.userDetails)

// delete user
router.route('/v1/delete').delete(apiAuth.validateToken, controller.deleteUser)

// Edit User Details
router.route('/v1/edit').put(apiAuth.validateToken,controller.editUser)

// change user password
router.route('/v1/changepassword').put(apiAuth.validateToken,controller.updatePassword)

// get all users email ID
router.route('/v1/emaillist').get(apiAuth.validateToken, controller.emailList)

module.exports = router