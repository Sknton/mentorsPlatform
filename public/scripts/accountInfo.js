fetch("http://localhost:3000/user/user", {
  credentials: "include",
})
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("username").textContent = data.username;
    document.getElementById("email").value = data.email;
  })
  .catch((error) => console.error("Error:", error));

document
  .querySelector("#accountInfoForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email");
    const prevPassword = document.querySelector("#prevPassword");
    const password = document.querySelector("#password");

    document.querySelector("#emailError").style.display = "none";
    document.querySelector("#prevPasswordError").style.display = "none";
    document.querySelector("#passwordError").style.display = "none";

    if (!email.value.trim()) {
      document.querySelector("#emailError").textContent = "Email is required";
      document.querySelector("#emailError").style.display = "block";
      return;
    }

    if (!prevPassword.value.trim()) {
      document.querySelector("#prevPasswordError").textContent =
        "Previous password is required";
      document.querySelector("#prevPasswordError").style.display = "block";
      return;
    }

    if (!password.value.trim()) {
      document.querySelector("#passwordError").textContent =
        "New password is required";
      document.querySelector("#passwordError").style.display = "block";
      return;
    }

    const response = await fetch("http://localhost:3000/user/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        prevPassword: prevPassword.value,
        password: password.value,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (data.error) {
      document.querySelector("#prevPasswordError").textContent = data.error;
      document.querySelector("#prevPassword").value = "";
      document.querySelector("#prevPasswordError").style.display = "block";
    } else {
      const popup = document.querySelector("#popup");
      popup.textContent = data.success;
      popup.style.display = "block";

      document.querySelector("#prevPassword").value = "";
      document.querySelector("#password").value = "";

      setTimeout(() => {
        popup.style.display = "none";
      }, 3000);
    }
  });
