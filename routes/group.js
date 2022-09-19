const express = require('express');
const controller = require("../controllers/groupController");

const router = express.Router();

// Create Group Route
router.route('/v1/create').post(controller.createGroup);

// View Group Details Route
router.route('/v1/view').get(controller.viewGroup);

// Get user groups Route
router.route('/v1/groups').post(controller.findAllUserGroups);

// Update group details Route
router.route('/v1/update').put(controller.updateGroup);

// Delete group Route
router.route('/v1/delete').delete(controller.deleteGroup);

// Make settlement router
router.route('/v1/makesettlement').post(controller.makeSettlement);

module.exports = router;    