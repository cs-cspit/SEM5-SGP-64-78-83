const express = require("express");
const router = express.Router();
const {
  createClient,
  getClientDetails,
  getAllClients,
  getMyClientDetails,
  updateMyClientDetails,
} = require("../controllers/clientController");
const { auth, adminAuth } = require("../middleware/auth");

// Only admin can create client users
router.post("/", adminAuth, createClient);
router.get("/", adminAuth, getAllClients);
router.get("/:userId", adminAuth, getClientDetails);

// Clients can access their own details
router.get("/my/details", auth, getMyClientDetails);

// Clients can update their own details
router.put("/my/details", auth, updateMyClientDetails);

module.exports = router;
