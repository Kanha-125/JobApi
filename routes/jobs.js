const express = require("express")
const router = express.Router();
const { deletejob, createJob, updateJob, getAllJobs, getJob } = require("../controllers/jobs.js")

router.route("/").post(createJob).get(getAllJobs)
router.route("/:id").get(getJob).delete(deletejob).patch(updateJob)

module.exports = router
