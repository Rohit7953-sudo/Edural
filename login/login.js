const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Simple authentication
  if (username === "admin" && password === "1234") {
    // store session flag
    localStorage.setItem("isAdminLoggedIn", "true");
    window.open("../dashboard/dash.html", "_blank");
  } else {
    errorMsg.textContent = "Invalid username or password!";
  }
});
(function(){
  alert('user_name is : admin \n password is : 1234 \n kindly go throuh with it')
})()
