const courseId = window.location.pathname.split("/").pop();

generateUniqueFilename = function (originalFilename) {
  const parts = originalFilename.split(".");
  const extension = parts.length > 1 ? parts.pop() : "";
  if (!extension) {
    throw new Error("Invalid filename");
  }
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000); // random number between 0 and 999
  return `${timestamp}-${random}.${extension}`;
};

window.onload = function () {
  fetch(`/mentors/api/${courseId}`)
    .then((response) => response.json())
    .then((course) => {
      course = course.course;
      document.getElementById("courseName").value = course.course_name;
      document.getElementById("authorName").value = course.author_name;
      document.getElementById("courseDescription").value =
        course.course_description;
      document.getElementById("category").value = course.category;
      document.getElementById("courseHashtags").value = course.hashtags
        .split(" ")
        .map((element) => element.substring(1))
        .join(" ");
      document.getElementById("yearsOfExperience").value =
        course.years_of_experience;
      document.getElementById("experience").value = course.experience;
      document.getElementById("linkedIn").value = course.linked_in;
      document.getElementById("github").value = course.github;
      document.getElementById("courseImage").src = `/images/${course.img_url}`;
    })
    .catch((error) => console.error("Error:", error));
};

document
  .getElementById("createCourseForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const imageFile = document.querySelector("#imgUrl").files[0];
    const uniqueFilename = imageFile
      ? generateUniqueFilename(imageFile.name)
      : null;

    // Only set the imgUrl field if a new image file was provided
    if (imageFile) {
      formData.set("imgUrl", imageFile, uniqueFilename);
    }

    const response = await fetch(`/mentors/edit-course/${courseId}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      console.error("Failed to create course", response);
    } else {
      console.log("Course created successfully");
      window.location.href = "/mentors";
    }
  });
