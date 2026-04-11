import { usersDB } from "../db/data.js";
import { User } from "../dto/user.js";

export class UserModel {
getUserByUsername(username) {
    const user = usersDB.find(user => user.username === username);
    if (!user) {
        alert("User not found.");
        return { isValid: false, user: null };
    }
    return { isValid: true, 
        user: new User(
            user.id, 
            user.username, 
            user.name, 
            user.email, 
            user.password
        ) 
    };
}
}