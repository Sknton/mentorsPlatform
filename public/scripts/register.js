"use strict";

document
  .querySelector("#registrationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#username");
    const password = document.querySelector("#password");
    const email = document.querySelector("#email");

    // Check if fields are empty
    if (!username.value.trim()) {
      showError(username, "Username is required");
      return;
    }

    if (!password.value.trim()) {
      showError(password, "Password is required");
      return;
    }

    if (!email.value.trim()) {
      showError(email, "Email is required");
      return;
    }

    const response = await fetch("http://localhost:3000/user/sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        email: email.value,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      showError(username, responseData.message);
    } else {
      // Show the pop-up window with the success message
      const popup = document.querySelector("#popup");
      popup.textContent = responseData.success;
      popup.style.display = "block";

      // Hide the pop-up window after 3 seconds
      setTimeout(() => {
        popup.style.display = "none";
      }, 3000);
    }
  });

function showError(input, message) {
  const errorElement = input.parentNode.querySelector(".error-message");
  errorElement.textContent = message;
  errorElement.style.display = "block";
  setTimeout(() => {
    errorElement.style.display = "none";
  }, 5000);
}
