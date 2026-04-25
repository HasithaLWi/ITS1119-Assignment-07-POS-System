import { UserModel } from "../model/userModel.js";
import { User } from "../dto/user.js";
import { showAlert, showConfirm } from "../utils/showAlert.js";

window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SET_ACCENT") {
        document.body.style.setProperty("--accent-color", event.data.color);
    }
});


const userModelInstance = new UserModel();
let userDataList = [];

function loadAllUsers() {
    userDataList = userModelInstance.getAllUsers().users;
    console.log(userDataList);
}

function loadUserTable(userData = userDataList) {
    const userTableBody = $("#users-table-body");
    if (!userTableBody.length) {
        return;
    }
    userTableBody.html("");
    if (userModelInstance.getAllUsers().isEmpty) {
        userTableBody.html(`<tr><td colspan='7'>No users found.</td></tr>`);
        return;
    } else {
        userTableBody.html(``);
        userData.forEach((user, index) => {
            const $row = $("<tr></tr>");
            const userId = user.id || (index + 1);
            $row.html(`
                <td>${userId}</td>
                <td>${user.name}</td>
                <td>${user.role}</td>
                <td>${user.address}</td>
                <td>${user.phone}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td style="display: flex; justify-content: left; gap: 20px;">
                    <i class="bi bi-trash3 user-delete-btn" data-index="${index}"></i>
                    <i class="bi bi-pencil-square user-table-update-btn" data-index="${index}"></i>
                </td>
            `);
            userTableBody.append($row);
        });
    }
}

document.addEventListener("click", (e) => {
    if (e.target.id === "user-save-btn") {
        saveUser();
    }

    if (e.target.id === "user-update-btn") {
        updateUser();
    }

    if (e.target.id === "user-reset-btn") {
        resetUserPage();
    }

});


// Save Customer
export function saveUser() {
    const nameInput = document.getElementById("user-name-input");
    const phoneInput = document.getElementById("user-phone-input");
    const addressInput = document.getElementById("user-address-input");
    const usernameInput = document.getElementById("user-username-input");
    const passwordInput = document.getElementById("user-password-input");
    const emailInput = document.getElementById("user-email-input");
    const roleInput = document.getElementById("user-role-input");
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleInput.value.trim();


    const validation = isUserFormValid(false);
    if (!validation.isValid) {
        showAlert("Invalid Input", validation.message, "warning");
        return;
    }
    const newUserId = userModelInstance.generateNewUserId();
    const newUser = new User(newUserId, username, password, role, name, address, phone, email);
    console.log(newUser);


    const result = userModelInstance.saveUser(newUser);
    showAlert(result.title, result.message, result.type);

    if (!result.isError) {
        resetUserPage();
    }
}

// Update User
export function updateUser() {
    const idInput = $("#user-id-input");
    const nameInput = $("#user-name-input");
    const phoneInput = $("#user-phone-input");
    const addressInput = $("#user-address-input");
    const usernameInput = $("#user-username-input");
    const passwordInput = $("#user-password-input");
    const emailInput = $("#user-email-input");
    const roleInput = $("#user-role-input");

    const id = idInput.val();
    const name = nameInput.val().trim();
    const phone = phoneInput.val().trim();
    const address = addressInput.val().trim();
    const username = usernameInput.val().trim();
    const password = passwordInput.val().trim();
    const email = emailInput.val().trim();
    const role = roleInput.val().trim();

    if (id === "") {
        showAlert("No User Selected", "Please select a user first.", "info");
        return;
    }
    const validation = isUserFormValid(true);
    if (!validation.isValid) {
        showAlert("Invalid Input", validation.message, "warning");
        return;
    }

    const result = userModelInstance.updateUser(new User(id, username, password, role, name, address, phone, email));
    if (!result.isError) {
        resetUserPage();
    }
    showAlert(result.title, result.message, result.type);

}

// Delete User
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("user-delete-btn")) {
        if (!await showConfirm("Confirmation Alert", "Are you sure you want to delete this user?", "question")) {
            return;
        }
        const index = event.target.dataset.index;
        if (index !== undefined) {
            userDataList.forEach((user, i) => {
                if (i == index) {
                    const result = userModelInstance.deleteUser(user.id);
                    if (result.isError) {
                        showAlert(result.title, result.message, result.type);
                        return;
                    }
                    loadAllUsers();
                    loadUserTable();
                    showAlert(result.title, result.message, result.type);
                }
            });
        }
    } else if (event.target.classList.contains("user-table-update-btn")) {
        const index = event.target.dataset.index;
        if (index !== undefined) {
            userDataList.forEach((users, i) => {
                if (i == index) {
                    const result = userModelInstance.getUserById(users.id);
                    if (result.isError) {
                        showAlert(result.title, result.message, result.type);
                        return;
                    }
                    const user = result.user;
                    $("#user-id-input").val(user.id);
                    $("#user-name-input").val(user.name);
                    $("#user-phone-input").val(user.phone);
                    $("#user-address-input").val(user.address);
                    $("#user-username-input").val(user.username);
                    $("#user-email-input").val(user.email);
                    $("#user-role-input").val(user.role);
                    $("#user-password-input").val(user.password);

                }
            });
        }
    }
});

//select user from table to form
document.addEventListener("click", (event) => {
    if (event.target.tagName === "TD" && event.target.parentElement.parentElement.id === "users-table-body") {
        const cells = event.target.parentElement.children;

        $("#user-name-input").val(cells[1].textContent);
        $("#user-phone-input").val(cells[4].textContent);
        $("#user-address-input").val(cells[3].textContent);
        $("#user-username-input").val(cells[5].textContent);
        $("#user-email-input").val(cells[6].textContent);

        const userId = cells[0].textContent;
        const result = userModelInstance.getUserById(userId);
        if (result.isError) {
            showAlert(result.title, result.message, result.type);
            return;
        }
        const user = result.user;

        $("#user-id-input").val(user.id);
        $("#user-password-input").val(user.password);

        const roleValue = cells[2].textContent;

        if (roleValue === "Cashier") {
            $("#user-role-input").val("Cashier");
        } else if (roleValue === "Manager") {
            $("#user-role-input").val("Manager");
        } else if (roleValue === "Admin") {
            $("#user-role-input").val("Admin");
        }
    }
});


// Search User
$("#user-search").on("input", function () {
    const query = this.value.toLowerCase().trim();
    const tableBody = $("#users-table-body");

    if (!query) {
        loadUserTable(userDataList);
        return;
    }

    const filtered = userDataList.filter(user =>
        Object.values(user).some(val =>
            String(val).toLowerCase().includes(query)
        )
    );

    if (filtered.length === 0) {
        tableBody.html("<tr><td colspan='8'>No users found.</td></tr>");
    } else {
        tableBody.html("");
        loadUserTable(filtered);
    }
});

// Validate Single Field
export function validateField(fieldId, value, skipDuplicateCheck = false) {
    let isValid = true;
    let message = "";

    if (fieldId === "user-name-input") {
        if (value === "") {
            isValid = false;
            message = "Name is required.";
        } else if (!/^[a-zA-Z\s]{3,50}$/.test(value)) {
            isValid = false;
            message = "Name must contain only letters and spaces (3-50 characters).";
        }
        showUserMessage("name", message, isValid ? "success" : "error");
    } else if (fieldId === "user-phone-input") {
        if (value === "") {
            isValid = false;
            message = "Phone is required.";
        } else if (!/^\d{10}$/.test(value)) {
            isValid = false;
            message = "Phone must be exactly 10 digits.";
        } else if (!skipDuplicateCheck) {
            const existingUser = userDataList.find(u => u.phone === value);
            if (existingUser) {
                isValid = false;
                message = "Phone number already exists.";
            }
        }
        showUserMessage("phone", message, isValid ? "success" : "error");
    } else if (fieldId === "user-address-input") {
        if (value === "") {
            isValid = false;
            message = "Address is required.";
        } else if (value.length < 3) {
            isValid = false;
            message = "Address must be at least 3 characters.";
        }
        showUserMessage("address", message, isValid ? "success" : "error");
    } else if (fieldId === "user-username-input") {
        if (value === "") {
            isValid = false;
            message = "Username is required.";
        } else if (!/^[a-zA-Z0-9]{3,}$/.test(value)) {
            isValid = false;
            message = "Username must be at least 3 characters.";
        }
        showUserMessage("username", message, isValid ? "success" : "error");
    } else if (fieldId === "user-password-input") {
        if (value === "") {
            isValid = false;
            message = "Password is required.";
        } else if (!/^[a-zA-Z0-9]{3,}$/.test(value)) {
            isValid = false;
            message = "Password must be at least 3 characters.";
        }
        showUserMessage("password", message, isValid ? "success" : "error");
    } else if (fieldId === "user-email-input") {
        if (value === "") {
            isValid = false;
            message = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            message = "Invalid email address.";
        } else if (!skipDuplicateCheck) {
            const existingUser = userDataList.find(u => u.email === value);
            if (existingUser) {
                isValid = false;
                message = "Email already exists.";
            }
        }
        showUserMessage("email", message, isValid ? "success" : "error");
    } else if (fieldId === "user-role-input") {
        if (document.getElementById("user-role-input").selectedIndex === 0) {
            isValid = false;
            message = "Role is required.";
        }
        showUserMessage("role", message, isValid ? "success" : "error");
    }

    return isValid;
}

// Validate User Form
export function isUserFormValid(skipDuplicateCheck = false) {
    const fields = [
        "user-name-input",
        "user-phone-input",
        "user-address-input",
        "user-username-input",
        "user-password-input",
        "user-email-input",
        "user-role-input"
    ];
    let isFormValid = true;



    fields.forEach(fieldId => {
        const value = document.getElementById(fieldId).value.trim();
        const isFieldValid = validateField(fieldId, value, skipDuplicateCheck);
        if (!isFieldValid) {
            isFormValid = false;

        }
    });



    return { isValid: isFormValid, message: "Fill Form With Valid Data." };
}

function showUserMessage(inputField, message = "", type) {
    const msgElements = {
        "name": document.getElementById("user-name-massege"),
        "phone": document.getElementById("user-phone-massege"),
        "address": document.getElementById("user-address-massege"),
        "username": document.getElementById("user-username-massege"),
        "password": document.getElementById("user-password-massege"),
        "email": document.getElementById("user-email-massege"),
        "role": document.getElementById("user-role-massege")
    };

    const msgElement = msgElements[inputField];
    if (msgElement) {
        if (type === "error") {
            msgElement.style.color = "red";
            msgElement.innerHTML = `<i class="bi bi-exclamation-circle"></i> ${message}`;
            msgElement.classList.remove("hidden");
        } else if (type === "success") {
            msgElement.style.color = "green";
            msgElement.innerHTML = `<i class="bi bi-check-circle-fill"></i>`;
            msgElement.classList.remove("hidden");
        } else {
            msgElement.classList.add("hidden");
        }
    }
}

document.querySelectorAll(".form-input").forEach(input => {
    if (input.tagName === "SELECT") {
        input.addEventListener("change", (e) => {
            validateField(e.target.id, e.target.value.trim());
        });
    } else {
        input.addEventListener("input", (e) => {
            validateField(e.target.id, e.target.value.trim());
        });
    }
});

export function resetUserPage() {
    document.getElementById("user-id-input").value = "";
    const nameInput = document.getElementById("user-name-input");
    const phoneInput = document.getElementById("user-phone-input");
    const addressInput = document.getElementById("user-address-input");
    const usernameInput = document.getElementById("user-username-input");
    const passwordInput = document.getElementById("user-password-input");
    const emailInput = document.getElementById("user-email-input");
    const roleInput = document.getElementById("user-role-input");
    const searchInput = document.getElementById("user-search");
    searchInput.value = "";
    nameInput.value = "";
    phoneInput.value = "";
    addressInput.value = "";
    usernameInput.value = "";
    passwordInput.value = "";
    emailInput.value = "";

    roleInput.selectedIndex = 0;


    document.getElementById("user-name-massege").classList.add("hidden");
    document.getElementById("user-name-massege").innerHTML = "";
    document.getElementById("user-phone-massege").classList.add("hidden");
    document.getElementById("user-phone-massege").innerHTML = "";
    document.getElementById("user-address-massege").classList.add("hidden");
    document.getElementById("user-address-massege").innerHTML = "";
    document.getElementById("user-username-massege").classList.add("hidden");
    document.getElementById("user-username-massege").innerHTML = "";
    document.getElementById("user-password-massege").classList.add("hidden");
    document.getElementById("user-password-massege").innerHTML = "";
    document.getElementById("user-email-massege").classList.add("hidden");
    document.getElementById("user-email-massege").innerHTML = "";
    document.getElementById("user-role-massege").classList.add("hidden");
    document.getElementById("user-role-massege").innerHTML = "";


    loadAllUsers();
    loadUserTable();
}

// Auto-load when the iframe document is ready
$(document).ready(() => {
    loadAllUsers();
    loadUserTable();
});




