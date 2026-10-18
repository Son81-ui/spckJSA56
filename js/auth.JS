
const STORAGE_KEY = "techstore_users";

function getUsers() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

function showMessage(id, message, success = false) {
    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = message;
    element.classList.toggle("success", success);
}

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const users = getUsers();
        const key = username.toLowerCase();

        if (username.length < 3) {
            showMessage("signupMessage", "Tên tài khoản cần ít nhất 3 ký tự.");
            return;
        }

        if (password.length < 6) {
            showMessage("signupMessage", "Mật khẩu cần ít nhất 6 ký tự.");
            return;
        }

        if (password !== confirmPassword) {
            showMessage("signupMessage", "Mật khẩu nhập lại không khớp.");
            return;
        }

        if (users[key]) {
            showMessage("signupMessage", "Tên tài khoản đã tồn tại.");
            return;
        }

        users[key] = {
            username: username,
            email: email,
            password: password
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        } catch {
            showMessage("signupMessage", "Không thể lưu tài khoản.");
            return;
        }

        showMessage("signupMessage", "Đăng ký thành công!", true);
        signupForm.reset();

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1000);
    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("loginUsername").value.trim();
        const password = document.getElementById("loginPassword").value;
        const users = getUsers();
        const user = users[username.toLowerCase()];

        if (!user || user.password !== password) {
            showMessage(
                "loginMessage",
                "Tên tài khoản hoặc mật khẩu không chính xác."
            );
            return;
        }

        try {
            localStorage.setItem("techstore_user", user.username);
        } catch {
            showMessage("loginMessage", "Không thể lưu trạng thái đăng nhập.");
            return;
        }

        showMessage("loginMessage", "Đăng nhập thành công!", true);

        setTimeout(function () {
            window.location.href = "index.html";
        }, 700);
    });
}
