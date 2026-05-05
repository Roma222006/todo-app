// 🔐 REGISTER
function register() {
    let username = document.getElementById("regUser").value;
    let password = document.getElementById("regPass").value;

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.text())
    .then(data => {
        alert(data); // "Registered"
        window.location.href = "login.html";
    })
    .catch(err => console.log("Register Error:", err));
}


// 🔐 LOGIN
function login() {
    let username = document.getElementById("loginUser").value;
    let password = document.getElementById("loginPass").value;

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data); // 👈 ADD THIS LINE

        if (data.success) {
            localStorage.setItem("user", username);
            localStorage.setItem("user_id", data.user.id);

            window.location.href = "index.html";
        } else {
            alert("Invalid Username or Password");
        }
    })
    .catch(err => console.log(err));
}


// 🚪 LOGOUT (optional if used here)
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    window.location.href = "login.html";
}