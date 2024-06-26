function fetchAndDisplayCourses(searchTerm) {
  fetch("/mentors/api/users-courses")
    .then((response) => response.json())
    .then((courses) => {
      let filteredCourses;
      if (searchTerm.trim() === "") {
        filteredCourses = courses;
      } else {
        filteredCourses = courses.filter((course) => {
          return course.hashtags
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        });
      }
      const mentorList = document.getElementById("mentorList");
      mentorList.innerHTML = "";

      displayCourses(filteredCourses, mentorList);
    })
    .catch((error) => console.error("Error:", error));
}

fetchAndDisplayCourses("");

document.getElementById("searchTerm").addEventListener("input", function (e) {
  const searchTerm = e.target.value;
  fetchAndDisplayCourses(searchTerm);
});

function displayCourses(courses, mentorList) {
  courses.forEach((course) => {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    mentorList.appendChild(col);

    const card = document.createElement("div");
    card.className = "card h-100";
    col.appendChild(card);

    const img = document.createElement("img");
    img.src = "/images/" + course.img_url;
    img.className = "card-img-top";
    img.alt = course.course_name;
    card.appendChild(img);

    const body = document.createElement("div");
    body.className = "card-body";
    card.appendChild(body);

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = course.course_name;
    body.appendChild(title);

    const text = document.createElement("p");
    text.className = "card-text";
    text.textContent = course.hashtags.split(" ").slice(0, 4).join(" ");
    body.appendChild(text);

    const rating = document.createElement("p");
    rating.className = "card-text";
    rating.textContent =
      "Rating: " +
      (course.average_rating
        ? `${course.average_rating.toFixed(2)}/5`
        : "No reviews yet") +
      ` (${course.review_count} reviews)`;
    body.appendChild(rating);

    const infoButton = document.createElement("a");
    infoButton.href = `/mentors/${course.id}`;
    infoButton.className = "btn btn-inform";
    infoButton.textContent = "See more information";
    body.appendChild(infoButton);

    const editButton = document.createElement("a");
    editButton.href = `/mentors/edit-course/${course.id}`;
    editButton.className = "btn btn-primary m-1";
    editButton.textContent = "Edit";
    body.appendChild(editButton);

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger m-1";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      deleteCourse(course.id).then((data) => {
        if (data.success) {
          col.remove();
        } else {
          console.error(data.error);
        }
      });
    });
    body.appendChild(deleteButton);
  });
}

function deleteCourse(courseId) {
  return fetch(`/mentors/api/courses/${courseId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
}
