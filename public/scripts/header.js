$(function () {
  $("#navbar").load("/navbar.html", function () {
    fetch("http://localhost:3000/user/isLoggedIn", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const myCourses = document.getElementById("myCourses");
        if (data.isLoggedIn) {
          const accountInfo = document.getElementById("accountInfo");
          const logout = document.getElementById("logout");

          if (accountInfo && logout && myCourses) {
            accountInfo.style.display = "block";
            logout.style.display = "block";
            myCourses.style.display = "block";

            logout.addEventListener("click", () => {
              fetch("http://localhost:3000/user/logout", {
                method: "POST",
                credentials: "include",
              }).then(() => {
                accountInfo.style.display = "none";
                logout.style.display = "none";
                myCourses.style.display = "none";
              });
            });
          }
        } else {
          if (myCourses) {
            myCourses.style.display = "none";
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
