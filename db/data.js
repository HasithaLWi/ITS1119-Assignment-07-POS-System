const customerDB = [
	new Customer("CUS-001", "Customer one", "0709876543", "Galle"),
	new Customer("CUS-002", "Customer two", "0712345678", "Colombo"),
	new Customer("CUS-003", "Customer three", "0779876543", "Kandy"),
	new Customer("CUS-004", "Customer four", "0701234567", "Jaffna"),
	new Customer("CUS-005", "Customer five", "0765432198", "Matara")
];

const itemsList = [
	{ id: "ITM-001", name: "Item one", price: 5000, qty: 10 },
	{ id: "ITM-002", name: "Item two", price: 3000, qty: 5 },
	{ id: "ITM-003", name: "Item three", price: 1500, qty: 20 },
	{ id: "ITM-004", name: "Item four", price: 2500, qty: 15 },
	{ id: "ITM-005", name: "Item five", price: 4000, qty: 8 }
];

const ordersDetailsList = [
	{ orderId: "ORD-001", itemId: "ITM-001", qty: 2 },
	{ orderId: "ORD-002", itemId: "ITM-002", qty: 1 },
	{ orderId: "ORD-002", itemId: "ITM-003", qty: 3 },
	{ orderId: "ORD-003", itemId: "ITM-004", qty: 4 },
	{ orderId: "ORD-004", itemId: "ITM-005", qty: 2 },
	{ orderId: "ORD-004", itemId: "ITM-001", qty: 1 },
	{ orderId: "ORD-005", itemId: "ITM-003", qty: 5 }
];

const ordersList = [
	{ id: "ORD-001", customerId: "CUS-001", date: "2024-06-01", total: 10000, discount: 12, paid: 8800, orderDetails: [] },
	{ id: "ORD-002", customerId: "CUS-002", date: "2024-06-02", total: 5000, discount: 15, paid: 4250, orderDetails: [] },
	{ id: "ORD-003", customerId: "CUS-003", date: "2024-06-03", total: 15000, discount: 0, paid: 15000, orderDetails: [] },
	{ id: "ORD-004", customerId: "CUS-004", date: "2024-06-04", total: 12500, discount: 8, paid: 1500, orderDetails: [] },
	{ id: "ORD-005", customerId: "CUS-005", date: "2024-06-05", total: 8500, discount: 10, paid: 7650, orderDetails: [] }
];

const itemCartList = [
	{ itemId: "ITM-001", qty: 2 },
	{ itemId: "ITM-003", qty: 1 }
];