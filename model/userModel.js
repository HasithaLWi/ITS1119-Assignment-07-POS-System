import { usersDB } from "../db/data.js";
import { User } from "../dto/user.js";

export class UserModel {
    getUserByUsername(username) {
        const user = usersDB.find(user => user.username === username);
        if (!user) {
            alert("User not found.");
            return { isValid: false, user: null };
        }
        return {
            isValid: true,
            user: new User(
                user.id,
                user.username,
                user.password,
                user.role,
                user.name,
                user.address,
                user.phone,
                user.email
            )
        };
    }

    getUserById(id) {
        const user = usersDB.find(user => user.id === id);
        if (!user) {
            return { isError: true, title: "Error", message: "Invalid User ID.", type: "error", user: null };
        }
        return {
            isError: false,
            title: "Success",
            message: "User found successfully.",
            type: "success",
            user: user
        };
    }

    getAllUsers() {
        if (usersDB.length === 0) {
            return { isEmpty: true, users: [] };
        } else {
            return { isEmpty: false, users: [...usersDB] };
        }
    }

    saveUser(newUser) {
        usersDB.push(newUser);
        return { isError: false, title: "Success", message: "User saved successfully.", type: "success" };
    }

    // Update user
    updateUser(user) {
        const index = usersDB.findIndex(u => u.id === user.id);
        if (index >= 0 && index < usersDB.length) {
            usersDB[index] = { ...usersDB[index], ...user };
            return { isError: false, title: "Success", message: "User updated successfully.", type: "success" };
        } else {
            return { isError: true, title: "Error", message: "Invalid User ID.", type: "error" };
        }
    }

    // Delete user
    deleteUser(userId) {
        const index = usersDB.findIndex(u => u.id === userId);
        if (usersDB[index].id == "UID-001") {
            return { isError: true, title: "Error", message: "System Admin Cannot Be Deleted", type: "error" };
        }
        if (index >= 0 && index < usersDB.length) {
            usersDB.splice(index, 1);
            return { isError: false, title: "Success", message: "User deleted successfully.", type: "success" };
        } else {
            return { isError: true, title: "Error", message: "Invalid User ID.", type: "error" };
        }
    }

    generateNewUserId() {
        const maxId = usersDB.reduce((max, user) => {
            const numPart = parseInt(user.id.split("-")[1], 10);
            return Math.max(max, numPart);
        }, 0);
        return this.formatUserId(maxId + 1);
    }

    formatUserId(id) {
        return `UID-${String(id).padStart(3, "0")}`;
    }
}

