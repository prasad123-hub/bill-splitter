const express = require('express');
const controller = require("../controllers/expenseController");
const apiAuth = require("../helpers/apiAuthentication");

const router = express.Router()

// Create Expense Route
router.route('/v1/add').post(controller.addExpense)

// Edit expense route
router.route('/v1/edit').put(controller.editExpense)

// Delete expense route
router.route('/v1/delete').delete(controller.deleteExpense)

// Get expense route
router.route('/v1/view').post(controller.viewExpense)

// Group expense route
router.route('/v1/group').post(controller.viewGroupExpense)

// View User Expense route
router.route('/v1/user').post(controller.viewUserExpense)

// recent user expense route
router.route('/v1/recent').post(controller.recentUserExpenses)

//  Get group category expense router
router.route('/v1/group/categoryExp').post(controller.groupCategoryExpense)

// Get group monthly expense router 
router.route('/v1/group/monthlyExp').post(controller.groupMonthlyExpense)

// Get group daily expense router
router.route('/v1/group/dailyExp').post(controller.groupDailyExpense)

//Get user category expense router
router.route('/v1/user/categoryExp').post(controller.userCategoryExpense)

//Get user monthly expense router
router.route('/v1/user/monthlyExp').post(controller.userMonthlyExpense)

// Get user daily expense router
router.route('/v1/user/dailyExp').post(controller.userDailyExpense)

module.exports = router;