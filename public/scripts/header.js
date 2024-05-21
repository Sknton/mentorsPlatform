$(function () {
  $("#navbar").load("/navbar.html", function () {
    fetch("http://localhost:3000/user/isLoggedIn", {
      credentials: "include", // Include credentials such as cookies, authorization headers or TLS client certificates
    })
      .then((response) => response.json())
      .then((data) => {
        const myCourses = document.getElementById("myCourses");
        if (data.isLoggedIn) {
          // User is logged in
          const accountInfo = document.getElementById("accountInfo");
          const logout = document.getElementById("logout");

          if (accountInfo && logout && myCourses) {
            accountInfo.style.display = "block";
            logout.style.display = "block";
            myCourses.style.display = "block"; // Show the "My Courses" button

            logout.addEventListener("click", () => {
              // Send a request to the server to log out
              fetch("http://localhost:3000/user/logout", {
                method: "POST",
                credentials: "include", // Include credentials such as cookies, authorization headers or TLS client certificates
              }).then(() => {
                // Hide the account info, logout button and "My Courses" button
                accountInfo.style.display = "none";
                logout.style.display = "none";
                myCourses.style.display = "none";
              });
            });
          }
        } else {
          // User is not logged in
          if (myCourses) {
            myCourses.style.display = "none"; // Hide the "My Courses" button
          }
          const loginButton = document.createElement("a");
          loginButton.className = "nav-link";
          loginButton.href = "/user/login";
          loginButton.textContent = "Log in";
          document.querySelector(".navbar-nav").appendChild(loginButton);
        }
      });
  });
});
