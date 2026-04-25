import { resetDashboard } from "./dashboardController.js";
import { resetOrderForm } from "./orderController.js";
import { resetOrderHistory } from "./orderHistoryController.js";
import { resetCustomerpage } from "./customerController.js";
import { resetItemPage } from "./itemController.js";
import { UserModel } from "../model/userModel.js";
import { showAlert } from "../utils/showAlert.js";

const userModelInstance = new UserModel();

function getUserByUsername(username) {
    return userModelInstance.getUserByUsername(username);
}

// --- Authentication Logic ---

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
        return;
    }

    if (password === "") {
        showAlert("Password Required", "Please enter a password.", "warning");
        return;
    } else if (password !== getUserByUsername(username).user.password) {
        showAlert("Invalid Password", "Invalid password. Please try again.", "error");
        console.log(getUserByUsername(username).user.password);
        console.log(password);
        return;
    }

    document.getElementById("welcome-message").textContent = `Welcome, ${username}!`;
    document.getElementById("login").classList.add("hidden");
    document.getElementById("main-app").classList.remove("hidden");

    resetCustomerpage();
    resetItemPage();
    resetOrderForm();
    resetOrderHistory();
    resetDashboard();

});