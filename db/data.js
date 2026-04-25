import { Customer } from "../dto/customer.js";
import { Item } from "../dto/item.js";
import { User } from "../dto/user.js";



export const customerDB = [
	new Customer("CUS-001", "Customer one", "0709876543", "Galle"),
	new Customer("CUS-002", "Customer two", "0712345678", "Colombo"),
	new Customer("CUS-003", "Customer three", "0779876543", "Kandy"),
	new Customer("CUS-004", "Customer four", "0701234567", "Jaffna"),
	new Customer("CUS-005", "Customer five", "0765432198", "Matara")
];

export const itemDB = [
	new Item("ITM-001", "Item one", 500, 10),
	new Item("ITM-002", "Item two", 1000, 5),
	new Item("ITM-003", "Item three", 750, 8),
	new Item("ITM-004", "Item four", 1200, 3),
	new Item("ITM-005", "Item five", 300, 15)
];

export const usersDB = [
	new User("UID-001", "admin", "admin123", "Admin", "Admin User", "Galle", "0709876543", "admin@example.com"),
	new User("UID-002", "user1", "password1", "Cashier", "User One", "Colombo", "0712345678", "user1@example.com"),
	new User("UID-003", "user2", "password2", "Cashier", "User Two", "Kandy", "0779876543", "user2@example.com")
];

export const ordersDetailsList = [
	{ orderId: "ORD-001", itemId: "ITM-001", qty: 2 },
	{ orderId: "ORD-002", itemId: "ITM-002", qty: 1 },
	{ orderId: "ORD-002", itemId: "ITM-003", qty: 3 },
	{ orderId: "ORD-003", itemId: "ITM-004", qty: 4 },
	{ orderId: "ORD-004", itemId: "ITM-005", qty: 2 },
	{ orderId: "ORD-004", itemId: "ITM-001", qty: 1 },
	{ orderId: "ORD-005", itemId: "ITM-003", qty: 5 }
];

export const ordersList = [
	{ id: "ORD-001", customerId: "CUS-001", date: "2024-06-01", total: 10000, discount: 12, paid: 8800, orderDetails: [{ orderId: "ORD-001", itemId: "ITM-001", qty: 2 }] },
	{ id: "ORD-002", customerId: "CUS-002", date: "2024-06-02", total: 5000, discount: 15, paid: 4250, orderDetails: [{ orderId: "ORD-002", itemId: "ITM-002", qty: 1 }, { orderId: "ORD-002", itemId: "ITM-003", qty: 3 }] },
	{ id: "ORD-003", customerId: "CUS-003", date: "2024-06-03", total: 15000, discount: 0, paid: 15000, orderDetails: [{ orderId: "ORD-003", itemId: "ITM-004", qty: 4 }] },
	{ id: "ORD-004", customerId: "CUS-004", date: "2024-06-04", total: 12500, discount: 8, paid: 1500, orderDetails: [{ orderId: "ORD-004", itemId: "ITM-005", qty: 2 }, { orderId: "ORD-004", itemId: "ITM-001", qty: 1 }] },
	{ id: "ORD-005", customerId: "CUS-005", date: "2024-06-05", total: 8500, discount: 10, paid: 7650, orderDetails: [{ orderId: "ORD-005", itemId: "ITM-003", qty: 5 }] }
];



