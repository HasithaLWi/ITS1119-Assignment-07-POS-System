import { resetDashboard } from "./dashboardController.js";
import { resetOrderForm } from "./orderController.js";
import { resetOrderHistory } from "./orderHistoryController.js";
import { resetCustomerpage } from "./customerController.js";
import { resetItemPage } from "./itemController.js";
import { UserModel } from "../model/userModel.js";
import { showAlert, showConfirm } from "../utils/showAlert.js";

const userModelInstance = new UserModel();

function getUserByUsername(username) {
    return userModelInstance.getUserByUsername(username);
}



const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "") {
        showAlert("Username Required", "Please enter a username.", "warning");
        return;
    } else if (getUserByUsername(username).isValid === false) {
        showAlert("Invalid Username", "Invalid username. Please try again.", "error");
        resetLoginPage();
        return;
    }

    if (password === "") {
        showAlert("Password Required", "Please enter a password.", "warning");

        return;
    } else if (password !== getUserByUsername(username).user.password) {
        showAlert("Invalid Password", "Invalid password. Please try again.", "error");
        resetLoginPage();
        return;
    }


    // Authentication
    const userManageBtn = document.getElementById("side-profile");
    userManageBtn.style.display = "none";

    if (getUserByUsername(username).user.role === "Admin") {
        document.getElementById("sidebar-user-role").innerText = "ADMIN";
        userManageBtn.style.display = "flex";
    } else {
        document.getElementById("sidebar-user-role").innerText = "CASHIER";
        userManageBtn.style.display = "none";
    }

    resetLoginPage();


    document.getElementById("login").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");

    resetCustomerpage();
    resetItemPage();
    resetOrderForm();
    resetOrderHistory();
    resetDashboard();

});

const sideLogoutBtn = document.getElementById("side-logout");
sideLogoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    if (await showConfirm("Logout", "Are you sure you want to logout?", "warning")) {
        document.getElementById("login").classList.remove("hidden");
        document.getElementById("main-app").classList.add("hidden");

        resetLoginPage();
    }
});

function resetLoginPage() {
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}