const session = require("express-session");
const db = require("../database");
const path = require("path");
const fs = require("fs");

exports.getMentorsPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "findMentor.html"));
};
exports.getAllCourses = (req, res) => {
  const sql = `
      SELECT courses.*, AVG(course_reviews.rating) as average_rating, COUNT(course_reviews.rating) as review_count
      FROM courses
      LEFT JOIN course_reviews ON courses.id = course_reviews.course_id
      GROUP BY courses.id
    `;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("An error occurred");
      return;
    }

    res.json(result);
  });
};

exports.getCoursePage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "course.html"));
};
exports.getCourse = (req, res) => {
  const courseId = req.params.courseId;
  const sqlCourse = `SELECT * FROM courses WHERE id = ?`;
  const sqlReviews = `SELECT * FROM course_reviews WHERE course_id = ? ORDER BY id DESC LIMIT 5`;

  db.query(sqlCourse, [courseId], (err, courseResult) => {
    if (err) {
      console.error(err.message);
      res.status(500).send("An error occurred");
      return;
    }

    db.query(sqlReviews, [courseId], (err, reviewsResult) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("An error occurred");
        return;
      }

      res.json({ course: courseResult[0], reviews: reviewsResult });
    });
  });
};

exports.getCreateCoursePage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "createCourse.html"));
};
exports.createCourse = (req, res) => {
  const course = req.body;

  db.createCourse(course)
    .then((newCourse) => {
      res.json(newCourse);
    })
    .catch((error) => {
      console.error("Error:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the course." });
    });
};

async function saveImageFile(imageFile, filename) {
  const filePath = path.join(__dirname, "../public/images", filename);
  await imageFile.mv(filePath);
}

exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      category,
      courseHashtags,
      yearsOfExperience,
      experience,
      authorName,
      linkedIn,
      github,
    } = req.body;

    if (!req.file) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }

    const imageFile = req.file;
    const filename = imageFile.filename;

    const course = {
      user_id: req.session.userId,
      course_name: courseName,
      img_url: `${filename}`,
      course_description: courseDescription,
      category,
      hashtags: courseHashtags
        .split(" ")
        .map((hashtag) => "#" + hashtag.toLowerCase())
        .join(" "),
      years_of_experience: yearsOfExperience,
      experience,
      author_name: authorName,
      linked_in: linkedIn,
      github,
    };
    const sql = "INSERT INTO courses SET ?";
    db.query(sql, course, (err, result) => {
      if (err) {
        console.error(err.message);
        res
          .status(500)
          .json({ message: "An error occurred while creating the course" });
        return;
      }
      res.status(201).json({ message: "Course created successfully" });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.createReview = (req, res) => {
  const { courseId, rating, review } = req.body;

  if (!courseId || !rating || !review) {
    return res.status(400).send({ error: "Missing required information" });
  }

  const sql = "INSERT INTO course_reviews SET ?";
  const reviewObj = {
    user_id: req.session.userId,
    course_id: +courseId,
    rating,
    review,
  };

  db.query(sql, reviewObj, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).send({ error: "Server error" });
    } else {
      res.status(200).send({ success: "Review successfully created" });
    }
  });
};

exports.getUsersCoursesPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "usersCourses.html"));
};

exports.getUsersCourses = (req, res) => {
  try {
    const userId = req.session.userId;

    const sql = `
      SELECT courses.*, AVG(course_reviews.rating) as average_rating, COUNT(course_reviews.rating) as review_count
      FROM courses
      LEFT JOIN course_reviews ON courses.id = course_reviews.course_id
      WHERE courses.user_id = ?
      GROUP BY courses.id
    `;
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred" });
        return;
      }

      // If no courses found, send an error
      if (result.length === 0) {
        res.status(404).json({ error: "No courses found for this user" });
        return;
      }

      res.json(result);
    });
  } catch {
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.deleteCourse = (req, res) => {
  const courseId = req.params.courseId;

  const sqlGet = "SELECT * FROM courses WHERE id = ?";
  db.query(sqlGet, [courseId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: "An error occurred" });
      return;
    }

    if (result.length === 0) {
      res
        .status(404)
        .json({ success: false, error: "No course found with this ID" });
      return;
    }

    const course = result[0];
    const imagePath = path.join(
      __dirname,
      "../public",
      "images",
      course.img_url
    );

    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).json({
          success: false,
          error: "An error occurred while deleting the image",
        });
        return;
      }

      const sqlDeleteReviews = "DELETE FROM course_reviews WHERE course_id = ?";
      db.query(sqlDeleteReviews, [courseId], (err, result) => {
        if (err) {
          console.error(err.message);
          res.status(500).json({ success: false, error: "An error occurred" });
          return;
        }

        const sqlDeleteCourse = "DELETE FROM courses WHERE id = ?";
        db.query(sqlDeleteCourse, [courseId], (err, result) => {
          if (err) {
            console.error(err.message);
            res
              .status(500)
              .json({ success: false, error: "An error occurred" });
            return;
          }

          res.json({ success: true });
        });
      });
    });
  });
};

exports.getEditCoursePage = (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.session.userId;

  const sql = "SELECT * FROM courses WHERE id = ?";
  db.query(sql, [courseId], (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ success: false, error: "An error occurred" });
      return;
    }

    if (result.length === 0) {
      res
        .status(404)
        .json({ success: false, error: "No course found with this ID" });
      return;
    }

    const course = result[0];

    if (course.user_id !== userId) {
      res.status(403).json({
        success: false,
        error: "You do not have permission to edit this course",
      });
      return;
    }

    res.sendFile(path.join(__dirname, "../public", "editCourse.html"));
  });
};

exports.updateCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      category,
      courseHashtags,
      yearsOfExperience,
      experience,
      authorName,
      linkedIn,
      github,
    } = req.body;

    const imageFile = req.file;
    const filename = imageFile ? imageFile.filename : null;

    const sqlGet = "SELECT img_url FROM courses WHERE id = ?";
    db.query(sqlGet, [req.params.id], (err, result) => {
      if (err) {
        console.error(err.message);
        res
          .status(500)
          .json({ message: "An error occurred while updating the course" });
        return;
      }

      const oldImageFile = result[0].img_url;

      const course = {
        user_id: req.session.userId,
        course_name: courseName,
        course_description: courseDescription,
        category,
        hashtags: courseHashtags
          .split(" ")
          .map((hashtag) => "#" + hashtag.toLowerCase())
          .join(" "),
        years_of_experience: yearsOfExperience,
        experience,
        author_name: authorName,
        linked_in: linkedIn,
        github,
      };

      if (filename) {
        course.img_url = `${filename}`;

        const oldImagePath = path.join(
          __dirname,
          "../public/images",
          oldImageFile
        );
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error(err.message);
            res.status(500).json({
              message: "An error occurred while deleting the old image",
            });
            return;
          }
        });
      }

      const sqlUpdate = "UPDATE courses SET ? WHERE id = ?";
      db.query(sqlUpdate, [course, req.params.id], (err, result) => {
        if (err) {
          console.error(err.message);
          res
            .status(500)
            .json({ message: "An error occurred while updating the course" });
          return;
        }
        res.status(200).json({ message: "Course updated successfully" });
      });
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
