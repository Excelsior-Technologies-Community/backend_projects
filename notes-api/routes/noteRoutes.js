const express = require("express");
const router = express.Router();
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
} = require("../controllers/noteController");
const { protect } = require("../middleware/authMiddleware");

// All note endpoints are private and require valid authentication
router.use(protect);

router
  .route("/")
  .get(getNotes)
  .post(createNote);

router
  .route("/:id")
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
