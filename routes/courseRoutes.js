const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const courseController = require("../controllers/courseController");

router.get("/", courseController.getMentorsPage);
router.get("/courses", courseController.getAllCourses);
router.post(
  "/create-course",
  upload.single("imgUrl"),
  courseController.createCourse
);
router.get("/create-course", courseController.getCreateCoursePage);
router.get("/users-courses", courseController.getUsersCoursesPage);
router.get("/api/users-courses", courseController.getUsersCourses);
router.delete("/api/courses/:courseId", courseController.deleteCourse);
router.get("/edit-course/:courseId", courseController.getEditCoursePage);
router.get("/:courseId", courseController.getCoursePage);
router.get("/api/:courseId", courseController.getCourse);
router.post("/api/reviews", courseController.createReview);
router.put(
  "/edit-course/:id",
  upload.single("imgUrl"),
  courseController.updateCourse
);

module.exports = router;
