window.onload = function () {
  const courseId = window.location.pathname.split("/").pop();
  fetch("/mentors/api/" + courseId)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("courseName").textContent =
        data.course.course_name;
      document.getElementById("courseDescription").textContent =
        data.course.course_description;
      document.getElementById("courseImage").src =
        "/images/" + data.course.img_url;
      document.getElementById("authorName").textContent =
        data.course.author_name;
      document.getElementById("category").textContent = data.course.category;
      document.getElementById("hashtags").textContent = data.course.hashtags;
      document.getElementById("yearsOfExperience").textContent =
        data.course.years_of_experience;
      document.getElementById("experience").textContent =
        data.course.experience;
      document.getElementById("linkedIn").href = data.course.linked_in;
      document.getElementById("github").href = data.course.github;
      const reviewsContainer = document.getElementById("reviews");
      data.reviews.forEach((review) => {
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("card", "mt-3");
        const reviewBody = document.createElement("div");
        reviewBody.classList.add("card-body");
        const reviewText = document.createElement("p");
        reviewText.classList.add("card-text");
        reviewText.textContent = review.review;
        reviewBody.appendChild(reviewText);
        reviewElement.appendChild(reviewBody);
        reviewsContainer.appendChild(reviewElement);
      });
    })
    .catch((error) => console.error("Error:", error));

  const stars = Array.from(
    document.querySelectorAll("#rating .star")
  ).reverse();
  stars.forEach((star, index) => {
    star.addEventListener("click", function (event) {
      stars.forEach((star) => {
        star.classList.remove("selected");
      });

      for (let i = 0; i <= index; i++) {
        stars[i].classList.add("selected");
      }
    });
  });

  document
    .getElementById("reviewForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const rating = document.querySelectorAll("#rating .selected").length;
      const review = document.getElementById("reviewText").value;

      fetch("/mentors/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: courseId,
          rating: rating,
          review: review,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const selectedStars =
              document.querySelectorAll("#rating .selected");
            selectedStars.forEach((star) => {
              star.classList.remove("selected");
            });
            document.getElementById("reviewText").value = "";

            const reviewsContainer = document.getElementById("reviews");
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("card", "mt-3");
            const reviewBody = document.createElement("div");
            reviewBody.classList.add("card-body");
            const reviewText = document.createElement("p");
            reviewText.classList.add("card-text");
            reviewText.textContent = review;
            reviewBody.appendChild(reviewText);
            reviewElement.appendChild(reviewBody);
            reviewsContainer.appendChild(reviewElement);
          } else {
            console.error(data.error);
          }
        })
        .catch((error) => console.error("Error:", error));
    });
};
