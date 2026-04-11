import { resetDashboard } from "./dashboardController.js";
import { resetOrderForm } from "./orderController.js";
import { resetOrderHistory } from "./orderHistoryController.js";
import { resetCustomerpage } from "./customerController.js";
import { resetItemPage } from "./itemController.js";
import { UserModel } from "../model/userModel.js";

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
        alert("Please enter a username.");
        return;
    } else if (getUserByUsername(username).isValid === false) {
        alert("Invalid username. Please try again.");
        return;
    }

    if (password === "") {
        alert("Please enter a password.");
        return;
    } else if (password !== getUserByUsername(username).user.password) {
        alert("Invalid password. Please try again.");
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