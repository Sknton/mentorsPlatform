"use strict";

document
  .querySelector("#loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.querySelector("#loginUsername");
    const password = document.querySelector("#loginPassword");

    document.querySelector("#usernameError").style.display = "none";
    document.querySelector("#passwordError").style.display = "none";

    if (!username.value.trim()) {
      document.querySelector("#usernameError").textContent =
        "Username is required";
      document.querySelector("#usernameError").style.display = "block";
      return;
    }

    if (!password.value.trim()) {
      document.querySelector("#passwordError").textContent =
        "Password is required";
      document.querySelector("#passwordError").style.display = "block";
      return;
    }

    const response = await fetch("http://localhost:3000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    } else {
      window.location.href = "/mentors";
    }
  });
