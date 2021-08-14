const express = require("express");
const router = express.Router();

const {
  getAllStatus,
  getOneStatus,
  createStatus,
  editStatus,
  deleteStatus
} = require("../controllers");

router.route("/").get(getAllStatus).post(createStatus);

router.route("/:id").get(getOneStatus).patch(editStatus).delete(deleteStatus);

module.exports = router;
