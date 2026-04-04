const THEME_KEY = "pos-theme";
const ACCENT_KEY = "pos-accent";


function applyAccent(accentColor) {
	document.body.style.setProperty("--accent", accentColor);
}

function initAccentPicker() {
	const accentPicker = document.getElementById("accent-picker");
	const colorCircle = document.getElementById("color-theme-circle");
	const accentPalette = document.getElementById("accent-palette");
	const swatches = document.querySelectorAll(".accent-swatch");

	if (!accentPicker || !colorCircle || !accentPalette || swatches.length === 0) {
		return;
	}

	const defaultAccent = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#f04b66";
	const savedAccent = localStorage.getItem(ACCENT_KEY) || defaultAccent;

	applyAccent(savedAccent);
	swatches.forEach((swatch) => {
		swatch.classList.toggle("active", swatch.dataset.color === savedAccent);
	});

	colorCircle.addEventListener("click", (event) => {
		event.stopPropagation();
		accentPalette.classList.toggle("hidden");
		const isExpanded = !accentPalette.classList.contains("hidden");
		colorCircle.setAttribute("aria-expanded", String(isExpanded));
	});

	swatches.forEach((swatch) => {
		swatch.addEventListener("click", (event) => {
			event.stopPropagation();
			const selectedAccent = swatch.dataset.color;

			if (!selectedAccent) {
				return;
			}

			applyAccent(selectedAccent);
			localStorage.setItem(ACCENT_KEY, selectedAccent);

			swatches.forEach((item) => item.classList.remove("active"));
			swatch.classList.add("active");

			accentPalette.classList.add("hidden");
			colorCircle.setAttribute("aria-expanded", "false");
		});
	});

	document.addEventListener("click", (event) => {
		if (!accentPicker.contains(event.target)) {
			accentPalette.classList.add("hidden");
			colorCircle.setAttribute("aria-expanded", "false");
		}
	});
}

function applyTheme(theme, button) {
	const isLight = theme === "light";
	document.body.classList.toggle("light-mode", isLight);

	if (!button) {
		return;
	}

	const icon = button.querySelector(".theme-icon");
	const label = button.querySelector(".theme-label");

	if (icon) {
		icon.textContent = isLight ? "☀" : "🌙";
	}

	if (label) {
		label.textContent = isLight ? "Light" : "Dark";
	}

	const nextModeLabel = isLight ? "dark" : "light";
	button.setAttribute("aria-label", `Switch to ${nextModeLabel} mode`);
}

document.addEventListener("DOMContentLoaded", () => {
	const toggleButton = document.getElementById("theme-toggle");

	if (toggleButton) {
		const savedTheme = localStorage.getItem(THEME_KEY);
		const initialTheme = savedTheme === "light" ? "light" : "dark";
		applyTheme(initialTheme, toggleButton);

		toggleButton.addEventListener("click", () => {
			const isLightMode = document.body.classList.contains("light-mode");
			const nextTheme = isLightMode ? "dark" : "light";

			applyTheme(nextTheme, toggleButton);
			localStorage.setItem(THEME_KEY, nextTheme);
		});
	}

	initAccentPicker();
	updateDashboardStats();
});


// --- Authentication Logic ---

let username = "admin";
let password = "admin123";

const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", (event) => {
	event.preventDefault();
	const username = document.getElementById("username").value.trim();
	const password = document.getElementById("password").value.trim();

	if (username === "") {
		alert("Please enter a username.");
		return;
	} else if (username !== "admin") {
		alert("Invalid username. Please try again.");
		return;
	}

	if (password === "") {
		alert("Please enter a password.");
		return;
	} else if (password !== "admin123") {
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

});

// --- Navigation Logic ---
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
	link.addEventListener('click', (e) => {
		e.preventDefault();
		const target = link.getAttribute('data-target');

		navLinks.forEach(l => l.classList.remove('active'));
		link.classList.add('active');

		pages.forEach(p => {
			p.classList.remove('active');
			p.classList.add('hidden');
			if (p.id === target) {
				p.classList.add('active');
				p.classList.remove('hidden');
			}
		});
	});
});



function updateDashboardStats() {
	const statCustomers = document.getElementById('stat-customers-count');
	const statItems = document.getElementById('stat-items-count');
	const statRevenue = document.getElementById('stat-revenue');

	if (statCustomers) {
		statCustomers.textContent = customerDB.length;
	}
	if (statItems) {
		statItems.textContent = itemsList.length;
	}
	if (statRevenue) {
		const totalRevenue = ordersList.reduce((sum, order) => {
			const total = Number(order.total);
			const discount = Number(order.discount);

			if (Number.isFinite(total) && Number.isFinite(discount)) {
				return sum + (total - discount);
			}

			const paid = Number(order.paid);
			return Number.isFinite(paid) ? sum + paid : sum;
		}, 0);

		statRevenue.textContent = totalRevenue.toFixed(2);
	}
}

function formatCustomerId(id) {
	return `CUS-${String(id).padStart(3, "0")}`;
}

function generateNewCustomerId() {
	const maxId = customerDB.reduce((max, customer) => {
		const numPart = parseInt(customer.id.split("-")[1], 10);
		return Math.max(max, numPart);
	}, 0);
	return formatCustomerId(maxId + 1);
}

function formatItemCode(id) {
	return `ITM-${String(id).padStart(3, "0")}`;
}

function generateNewItemCode() {
	const maxId = itemsList.reduce((max, item) => {
		const numPart = parseInt(item.id.split("-")[1], 10);
		return Math.max(max, numPart);
	}, 0);
	return formatItemCode(maxId + 1);
}

function formatOrderId(id) {
	return `ORD-${String(id).padStart(3, "0")}`;
}

function generateNewOrderId() {
	const maxId = ordersList.reduce((max, order) => {
		const numPart = parseInt(order.id.split("-")[1], 10);
		return Math.max(max, numPart);
	}, 0);
	return formatOrderId(maxId + 1);
}


// /* ----------------------------------------------------------------------------------------------
// 								Customers Management Logic
//    ----------------------------------------------------------------------------------------------*/

// // Fetch Customers from Local Storage
// function getAllCustomers(customers = customersList) {
// 	const customersTableBody = document.querySelector("#customers-table-body");
// 	if (!customersTableBody) {
// 		return;
// 	}
// 	if (customers.length === 0) {
// 		customersTableBody.innerHTML = "<tr><td colspan='5'>No customers found.</td></tr>";
// 		return;
// 	} else {
// 		customersTableBody.innerHTML = "";
// 		customers.forEach((customer, index) => {
// 			const row = document.createElement("tr");
// 			const customerId = customer.id || (index + 1);
// 			row.innerHTML = `
// 				<td>${customerId}</td>
// 				<td>${customer.name}</td>
// 				<td>${customer.phone}</td>
// 				<td>${customer.address}</td>
// 				<td><button class="buttons customer-buttons btn-delete customer-delete-btn" data-index="${index}">Delete</button>
// 				</td>
// 			`;
// 			customersTableBody.appendChild(row);
// 		});
// 	}
// }

// // Save Customer
// function saveCustomer() {
// 	const nameInput = document.getElementById("cust-name-input");
// 	const phoneInput = document.getElementById("cust-phone-input");
// 	const addressInput = document.getElementById("cust-address-input");
// 	const name = nameInput.value.trim();
// 	const phone = phoneInput.value.trim();
// 	const address = addressInput.value.trim();


// 	const validation = isCustomerFormValid(false); // Perform duplicate phone check for new customers
// 	if (!validation.isValid) {
// 		alert(validation.message);
// 		return;
// 	}
// 	const newCustomerId = generateNewCustomerId();
// 	const newCustomer = { id: newCustomerId, name, phone, address };
// 	customersList.push(newCustomer);
// 	updateDashboardStats();
// 	resetCustomerpage();
// }

// // Delete Customer
// document.addEventListener("click", (event) => {
// 	if (event.target.classList.contains("customer-delete-btn")) {
// 		if (!confirm("Are you sure you want to delete this customer?")) {
// 			return;
// 		}
// 		const index = event.target.dataset.index;
// 		if (index !== undefined) {
// 			customersList.splice(index, 1);
// 			updateDashboardStats();
// 			getAllCustomers();
// 		}
// 	}
// });

// // Update Customer
// function updateCustomer() {
// 	const idInput = document.getElementById("cust-id-input");
// 	const nameInput = document.getElementById("cust-name-input");
// 	const phoneInput = document.getElementById("cust-phone-input");
// 	const addressInput = document.getElementById("cust-address-input");
// 	const id = idInput.value.trim();
// 	const name = nameInput.value.trim();
// 	const phone = phoneInput.value.trim();
// 	const address = addressInput.value.trim();

// 	if (id === "") {
// 		alert("Please select a customer first.");
// 		return;
// 	}
// 	const validation = isCustomerFormValid(true);
// 	if (!validation.isValid) {
// 		alert(validation.message);
// 		return;
// 	}
// 	const index = customersList.findIndex(c => c.id === id);
// 	if (index >= 0 && index < customersList.length) {
// 		customersList[index] = { ...customersList[index], name, phone, address };
// 		updateDashboardStats();
// 		resetCustomerpage();
// 	} else {
// 		alert("Invalid Customer ID.");
// 	}
// }

// // Reset Customer Form
// function resetCustomerpage() {
// 	document.getElementById("cust-id-input").value = "";
// 	document.getElementById("cust-name-input").value = "";
// 	document.getElementById("cust-phone-input").value = "";
// 	document.getElementById("cust-address-input").value = "";
// 	document.getElementById("customer-search").value = "";
// 	getAllCustomers();
// }

// //select customer from table to form
// document.addEventListener("click", (event) => {
// 	if (event.target.tagName === "TD" && event.target.parentElement.parentElement.id === "customers-table-body") {
// 		const cells = event.target.parentElement.children;
// 		document.getElementById("cust-id-input").value = cells[0].textContent;
// 		document.getElementById("cust-name-input").value = cells[1].textContent;
// 		document.getElementById("cust-phone-input").value = cells[2].textContent;
// 		document.getElementById("cust-address-input").value = cells[3].textContent;
// 	}
// });

// // Validate Customer Form
// function isCustomerFormValid(skipDuplicateCheck = false) {
// 	const nameInput = document.getElementById("cust-name-input");
// 	const phoneInput = document.getElementById("cust-phone-input");
// 	const addressInput = document.getElementById("cust-address-input");
// 	const name = nameInput.value.trim();
// 	const phone = phoneInput.value.trim();
// 	const address = addressInput.value.trim();

// 	if (name === "" || phone === "" || address === "") {
// 		return { isValid: false, message: "Please fill in all fields." };
// 	}

// 	if (!/^[a-zA-Z\s]{3,50}$/.test(name)) {
// 		return { isValid: false, message: "Name must contain only letters and spaces (3-50 characters)." };
// 	}

// 	if (!/^\d{10}$/.test(phone)) {
// 		return { isValid: false, message: "Phone must be exactly 10 digits." };
// 	} else if (!skipDuplicateCheck) {
// 		const existingCustomer = customersList.find(c => c.phone === phone);
// 		if (existingCustomer) {
// 			return { isValid: false, message: "Phone number already exists." };
// 		}
// 	}

// 	if (address.length < 3) {
// 		return { isValid: false, message: "Address must be at least 3 characters." };
// 	}

// 	return { isValid: true, message: "" };
// }

// // Search Customers
// document.getElementById("customer-search").addEventListener("input", function () {
// 	const query = this.value.toLowerCase().trim();
// 	const tableBody = document.querySelector("#customers-table-body");

// 	if (!query) {
// 		getAllCustomers(customersList);
// 		return;
// 	}

// 	const filtered = customersList.filter(customer =>
// 		Object.values(customer).some(val =>
// 			String(val).toLowerCase().includes(query)
// 		)
// 	);

// 	if (filtered.length === 0) {
// 		tableBody.innerHTML = "<tr><td colspan='5'>No customers found.</td></tr>";
// 	} else {
// 		tableBody.innerHTML = "";
// 		getAllCustomers(filtered);
// 	}
// });

// /* ----------------------------------------------------------------------------------------------
// 								   Items Management Logic
//    ----------------------------------------------------------------------------------------------*/

// let selectedItemId = null;

// // Fetch Items from Local Storage
// function getAllItems(items = itemsList) {
// 	const itemsTableBody = document.querySelector("#items-table-body");
// 	if (!itemsTableBody) {
// 		return;
// 	}

// 	if (items.length === 0) {
// 		itemsTableBody.innerHTML = "<tr><td colspan='5'>No items found.</td></tr>";
// 		return;
// 	}

// 	itemsTableBody.innerHTML = "";
// 	items.forEach((item, index) => {
// 		const row = document.createElement("tr");
// 		const itemId = item.id || (index + 1);
// 		row.innerHTML = `
// 			<td>${itemId}</td>
// 			<td>${item.name}</td>
// 			<td>${item.price}</td>
// 			<td>${item.qty}</td>
// 			<td><button class="buttons item-buttons btn-delete item-delete-btn" data-index="${index}">Delete</button></td>
// 		`;
// 		itemsTableBody.appendChild(row);
// 	});
// }

// // Validate Item Form
// function isItemFormValid() {
// 	const itemNameInput = document.getElementById("item-name-input");
// 	const itemPriceInput = document.getElementById("item-price-input");
// 	const itemQtyInput = document.getElementById("item-qty-input");

// 	const name = itemNameInput.value.trim();
// 	const price = Number(itemPriceInput.value);
// 	const qty = Number(itemQtyInput.value);
// 	if (isNaN(itemPriceInput.value) || itemPriceInput.value.trim() === "") {
// 		return { isValid: false, message: "Please enter a valid price." };
// 	}
// 	if (isNaN(itemQtyInput.value) || itemQtyInput.value.trim() === "") {
// 		return { isValid: false, message: "Please enter a valid stock quantity." };
// 	}

// 	if (name === "" || itemPriceInput.value.trim() === "" || itemQtyInput.value.trim() === "") {
// 		return { isValid: false, message: "Please fill in all item fields." };
// 	}

// 	if (!/^[a-zA-Z0-9\s]{2,60}$/.test(name)) {
// 		return { isValid: false, message: "Item name must be 2-60 characters (letters, numbers, spaces)." };
// 	}

// 	if (Number.isNaN(price) || price <= 0) {
// 		return { isValid: false, message: "Price must be greater than 0." };
// 	}

// 	if (Number.isNaN(qty) || !Number.isInteger(qty) || qty < 0) {
// 		return { isValid: false, message: "Stock quantity must be a non-negative integer." };
// 	}

// 	return { isValid: true, message: "" };
// }

// // Save Item
// function saveItem() {
// 	const validation = isItemFormValid();
// 	if (!validation.isValid) {
// 		alert(validation.message);
// 		return;
// 	}

// 	const name = document.getElementById("item-name-input").value.trim();
// 	const price = Number(document.getElementById("item-price-input").value);
// 	const qty = Number(document.getElementById("item-qty-input").value);
// 	const newItemId = generateNewItemCode();

// 	itemsList.push({
// 		id: newItemId,
// 		name,
// 		price,
// 		qty
// 	});

// 	updateDashboardStats();
// 	resetItemPage();
// }

// // Update Item
// function updateItem() {
// 	const itemCodeInput = document.getElementById("item-code-input");
// 	const itemNameInput = document.getElementById("item-name-input");
// 	const itemPriceInput = document.getElementById("item-price-input");
// 	const itemQtyInput = document.getElementById("item-qty-input");

// 	if (selectedItemId === null) {
// 		alert("Please select an item first.");
// 		return;
// 	}

// 	const validation = isItemFormValid();
// 	if (!validation.isValid) {
// 		alert(validation.message);
// 		return;
// 	}

// 	const index = itemsList.findIndex((item) => item.id === selectedItemId);
// 	if (index < 0 || index >= itemsList.length) {
// 		alert("Invalid item code.");
// 		return;
// 	}

// 	itemsList[index] = {
// 		...itemsList[index],
// 		name: itemNameInput.value.trim(),
// 		price: Number(itemPriceInput.value),
// 		qty: Number(itemQtyInput.value)
// 	};

// 	updateDashboardStats();
// 	resetItemPage();
// }

// // Reset Item Form
// function resetItemPage() {
// 	document.getElementById("item-code-input").value = "";
// 	document.getElementById("item-name-input").value = "";
// 	document.getElementById("item-price-input").value = "";
// 	document.getElementById("item-qty-input").value = "";
// 	document.getElementById("item-search").value = "";
// 	selectedItemId = null;
// 	getAllItems();
// }


// // Delete Item
// document.addEventListener("click", (event) => {
// 	if (event.target.classList.contains("item-delete-btn")) {
// 		if (!confirm("Are you sure you want to delete this item?")) {
// 			return;
// 		}

// 		const index = event.target.dataset.index;
// 		if (index !== undefined) {
// 			itemsList.splice(index, 1);
// 			updateDashboardStats();
// 			getAllItems();
// 		}
// 	}
// });

// // Select item from table to form
// document.addEventListener("click", (event) => {
// 	if (event.target.tagName === "TD" && event.target.parentElement.parentElement.id === "items-table-body") {
// 		const cells = event.target.parentElement.children;

// 		selectedItemId = cells[0].textContent.trim();

// 		document.getElementById("item-code-input").value = cells[0].textContent.trim();
// 		document.getElementById("item-name-input").value = cells[1].textContent.trim();
// 		document.getElementById("item-price-input").value = cells[2].textContent.trim();
// 		document.getElementById("item-qty-input").value = cells[3].textContent.trim();
// 	}
// });


// // Search Items
// document.getElementById("item-search").addEventListener("input", function () {
// 	const query = this.value.toLowerCase().trim();
// 	const tableBody = document.querySelector("#items-table-body");


// 	if (!query) {
// 		getAllItems(itemsList);
// 		return;
// 	}


// 	const filtered = itemsList.filter(item =>
// 		Object.values(item).some(val =>
// 			String(val).toLowerCase().includes(query)
// 		)
// 	);


// 	if (filtered.length === 0) {
// 		tableBody.innerHTML = "<tr><td colspan='5'>No items found.</td></tr>";
// 	} else {
// 		tableBody.innerHTML = "";
// 		getAllItems(filtered);
// 	}
// });


// /* ----------------------------------------------------------------------------------------------
// 								   Orders Management Logic
//    ----------------------------------------------------------------------------------------------*/
// const customerSelector = document.getElementById("order-customer-select");
// const itemSelector = document.getElementById("order-item-select");

// function setupDateAndOrderId() {

// 	// Generate new order ID and set to order form
// 	const newOrderId = generateNewOrderId();
// 	document.getElementById("order-id-display").value = newOrderId;

// 	// Set today's date to order form
// 	const orderDateInput = document.getElementById("order-date");
// 	const today = new Date().toISOString().split("T")[0];
// 	if (orderDateInput) {
// 		orderDateInput.value = today;
// 	}
// }


// function loadOrderPage() {

// 	setupDateAndOrderId();


// 	// Populate customer dropdown in order form
// 	customerSelector.innerHTML = "";


// 	const existingCustomerOption = document.createElement("option");
// 	existingCustomerOption.value = "";
// 	existingCustomerOption.textContent = "Select Customer";
// 	customerSelector.appendChild(existingCustomerOption);

// 	const optionDefault = document.createElement("option");
// 	optionDefault.value = "";
// 	optionDefault.textContent = "Select None";
// 	customerSelector.appendChild(optionDefault);

// 	customersList.forEach(customer => {
// 		const option = document.createElement("option");
// 		option.value = customer.id;
// 		option.textContent = `${customer.name} (${customer.id})`;
// 		customerSelector.appendChild(option);
// 	});

// 	// Populate item dropdown in order form
// 	itemSelector.innerHTML = "";

// 	const itemOptionDefault = document.createElement("option");
// 	itemOptionDefault.value = "";
// 	itemOptionDefault.textContent = "Select Item";
// 	itemSelector.appendChild(itemOptionDefault);

// 	itemsList.forEach(item => {
// 		const option = document.createElement("option");
// 		option.value = item.id;
// 		option.textContent = `${item.name} (${item.id})`;
// 		itemSelector.appendChild(option);
// 	});
// }


// // load cart items
// function loadCartTable() {
// 	const cartTableBody = document.querySelector("#cart-table-body");
// 	if (!cartTableBody) {
// 		return;
// 	}
// 	cartTableBody.innerHTML = "";
// 	itemCartList.forEach((detail, index) => {
// 		const item = itemsList.find(i => i.id === detail.itemId);
// 		if (item) {
// 			const row = document.createElement("tr");
// 			row.innerHTML = `
// 				<td>${item.id}</td>
// 				<td>${item.name}</td>
// 				<td>${item.price}</td>
// 				<td>${detail.qty}</td>
// 				<td>${item.price * detail.qty}</td>
// 				<td><button class="buttons order-buttons btn-delete cart-item-delete-btn" data-index="${index}">-</button></td>	
// 			`;
// 			cartTableBody.appendChild(row);
// 		}
// 	});
// }

// // Select customer for order
// customerSelector.addEventListener("change", selectCustomerForOrder);

// function selectCustomerForOrder() {
// 	const customerIdInput = document.getElementById("order-cust-id");
// 	const customerNameInput = document.getElementById("order-cust-name");
// 	const customerPhoneInput = document.getElementById("order-cust-phone");
// 	const customerAddressInput = document.getElementById("order-cust-address");

// 	const selectedCustomer = document.getElementById("order-customer-select").value;
// 	if (selectedCustomer === "") {
// 		customerIdInput.value = "----";
// 		customerNameInput.value = "Walk-in Customer";
// 		customerPhoneInput.value = "----";
// 		customerAddressInput.value = "----";
// 		return;
// 	}
// 	const customer = customersList.find(c => c.id === selectedCustomer);
// 	if (customer) {
// 		customerIdInput.value = customer.id;
// 		customerNameInput.value = customer.name;
// 		customerPhoneInput.value = customer.phone;
// 		customerAddressInput.value = customer.address;
// 	} else {
// 		alert("Selected customer not found.");
// 	}
// }

// itemSelector.addEventListener("change", selectItemForOrder);

// function selectItemForOrder() {

// 	const itemIdInput = document.getElementById("order-item-code");
// 	const itemNameInput = document.getElementById("order-item-name");
// 	const itemPriceInput = document.getElementById("order-item-price");
// 	const itemQtyInput = document.getElementById("order-item-qty-on-hand");

// 	const selectedItemId = document.getElementById("order-item-select").value;
// 	if (selectedItemId === "") {
// 		itemIdInput.value = "";
// 		itemNameInput.value = "";
// 		itemPriceInput.value = "";
// 		itemQtyInput.value = "";
// 		return;

// 	}
// 	const item = itemsList.find(i => i.id === selectedItemId);
// 	if (item) {
// 		itemIdInput.value = item.id;
// 		itemNameInput.value = item.name;
// 		itemPriceInput.value = item.price;
// 		itemQtyInput.value = item.qty;
// 	} else {
// 		alert("Selected item not found.");
// 	}
// }

// // reset order form
// function resetOrderForm() {
// 	document.getElementById("order-id-display").value = "";
// 	document.getElementById("order-date").value = "";
// 	document.getElementById("order-cust-id").value = "";
// 	document.getElementById("order-cust-name").value = "";
// 	document.getElementById("order-cust-phone").value = "";
// 	document.getElementById("order-cust-address").value = "";
// 	document.getElementById("order-item-code").value = "";
// 	document.getElementById("order-item-name").value = "";
// 	document.getElementById("order-item-price").value = `${(0).toFixed(2)}`;
// 	document.getElementById("order-item-qty-on-hand").value = 0;
// 	document.getElementById("order-customer-select").value = "";
// 	document.getElementById("order-item-select").value = "";
// 	document.getElementById("order-item-qty").value = 1;
// 	document.getElementById("discount-input").value = 0;
// 	document.getElementById("cash-input").value = `${(0).toFixed(2)}`;
// 	document.getElementById("balance-display").value = `${(0).toFixed(2)}`;
// 	document.getElementById("order-total-display").textContent = `${(0).toFixed(2)}`;
// 	document.getElementById("order-subtotal-display").textContent = `${(0).toFixed(2)}`;
// 	document.getElementById("balance-label").textContent = "Balance";
// 	document.getElementById("balance-label").style.color = "";

// 	itemCartList.length = 0;
// 	loadCartTable();
// 	setupDateAndOrderId();
// 	hideDiscountFieldError();
// 	hidePaidFieldError();
// 	hideOrderUpdateButton();
// }

// function addItemToCart() {
// 	const itemId = document.getElementById("order-item-code").value.trim();
// 	const qty = Number(document.getElementById("order-item-qty").value);
// 	const onHandQty = document.getElementById("order-item-qty-on-hand");

// 	const isValid = isOrderFormValid();
// 	if (!isValid.isValid) {
// 		alert(isValid.message);
// 		return;
// 	}

// 	const existingCartItem = itemCartList.find(i => i.itemId === itemId);

// 	onHandQty.value -= qty;

// 	if (existingCartItem) {
// 		existingCartItem.qty += qty;


// 	} else {
// 		itemCartList.push({ itemId, qty });
// 	}
// 	loadCartTable();
// 	calculateOrderTotals();
// }

// function isOrderFormValid() {
// 	const itemId = document.getElementById("order-item-code").value.trim();
// 	const qty = Number(document.getElementById("order-item-qty").value);
// 	const onHandQty = document.getElementById("order-item-qty-on-hand");

// 	if (itemId === "" || Number.isNaN(qty) || qty <= 0) {
// 		return { isValid: false, message: "Please select an item and enter a valid quantity." };
// 	}
// 	const item = itemsList.find(i => i.id === itemId);
// 	if (!item) {
// 		return { isValid: false, message: "Selected item not found." };
// 	}
// 	if (qty > onHandQty.value) {
// 		return { isValid: false, message: "Requested quantity exceeds available stock." };
// 	}
// 	return { isValid: true };
// }


// let discount = 0;
// let paid = 0;
// let balance = 0;
// let totalDisplay = "0";
// let subtotalDisplay = "0";

// function calculateOrderTotals() {
// 	const totalLabel = document.getElementById("order-total-display");
// 	const subtotalLabel = document.getElementById("order-subtotal-display");
// 	const discountPreField = document.getElementById("discount-input");
// 	const paidField = document.getElementById("cash-input");
// 	const balanceField = document.getElementById("balance-display");




// 	const total = itemCartList.reduce((sum, cartItem) => {
// 		const item = itemsList.find(i => i.id === cartItem.itemId);
// 		return sum + (item ? item.price * cartItem.qty : 0);
// 	}, 0);

// 	if (isdiscountFieldValid().isValid) {
// 		discount = total * (Number(discountPreField.value) / 100);
// 		hideDiscountFieldError();
// 	} else {
// 		showDiscountFieldError();
// 	}


// 	if (isPaidFieldValid().isValid) {
// 		paid = Number(paidField.value);
// 		hidePaidFieldError();
// 	} else {
// 		showPaidFieldError();
// 	}


// 	totalDisplay = `${total.toFixed(2)}`;
// 	subtotalDisplay = `${(total - discount).toFixed(2)}`;
// 	balance = `${(Number(subtotalDisplay) - Number(paid)).toFixed(2)}`;

// 	totalLabel.textContent = totalDisplay;
// 	subtotalLabel.textContent = subtotalDisplay;
// 	balanceField.value = balance;
// 	setupChangeAndDue();
// }

// const cashInputField = document.getElementById("cash-input");
// if (cashInputField) {
// 	cashInputField.addEventListener("input", calculateOrderTotals);
// }

// const discountInputField = document.getElementById("discount-input");
// if (discountInputField) {
// 	discountInputField.addEventListener("input", calculateOrderTotals);
// }



// function placeOrder() {

// 	const newOrderId = generateNewOrderId();
// 	const customerId = document.getElementById("order-cust-id").value.trim();
// 	const orderDate = document.getElementById("order-date").value;
// 	const discountPreField = document.getElementById("discount-input");

// 	if (itemCartList.length === 0) {
// 		alert("Please add at least one item to the cart before placing the order.");
// 		return;
// 	}



// 	if (!isPlaceOrderFormValid().isValid) {
// 		alert(isPlaceOrderFormValid().message);
// 		return;
// 	}

// 	const details = itemCartList.map(cartItem => ({
// 		orderId: newOrderId,
// 		itemId: cartItem.itemId,
// 		qty: cartItem.qty
// 	}));

// 	ordersDetailsList.push(...details);

// 	details.map(detail => {
// 		const item = itemsList.find(i => i.id === detail.itemId);
// 		if (item) {
// 			item.qty -= detail.qty;
// 		}
// 	});

// 	const newOrder = {
// 		id: newOrderId,
// 		customerId: customerId === "" ? null : customerId,
// 		date: orderDate,
// 		total: totalDisplay,
// 		discount: discountPreField.value.trim() === "" ? "0" : discountPreField.value,
// 		paid: paid,
// 		orderDetails: details
// 	};


// 	ordersList.push(newOrder);

// 	alert("Order placed successfully!");
// 	updateDashboardStats();
// 	resetOrderForm();
// 	resetOrderHistory();
// }

// // validate place order form
// function isPlaceOrderFormValid() {
// 	const customerId = document.getElementById("order-cust-id").value.trim();
// 	const orderDate = document.getElementById("order-date").value;
// 	const discountPreField = document.getElementById("discount-input");
// 	const paidField = document.getElementById("cash-input");
// 	const subtotalElement = document.getElementById("order-subtotal-display");
// 	const subtotalAmount = Number(subtotalElement ? subtotalElement.textContent : 0);

// 	if (!discountPreField || !paidField || !subtotalElement) {
// 		return { isValid: false, message: "Order summary fields are missing." };
// 	}

// 	if (!(customerId === "" || customerId === "----" || customerId === null)) {
// 		if (!customersList.some(c => c.id === customerId)) {
// 			return { isValid: false, message: "Selected customer not found." };
// 		}
// 	}

// 	if (orderDate === "" || orderDate === null) {
// 		return { isValid: false, message: "Please select an order date." };
// 	}

// 	if (discountPreField.value.trim() === "" || discountPreField.value === null) {
// 		discountPreField.value = "0";

// 	} else if (isNaN(discountInputField.value) || Number.isNaN(Number(discountPreField.value))
// 		|| Number(discountPreField.value) < 0 || Number(discountPreField.value) > 100) {

// 		return { isValid: false, message: "Please enter a valid discount amount (0%-100%)." };
// 	}

// 	if (paidField.value.trim() === "" || paidField.value === null) {
// 		return { isValid: false, message: "Please enter the amount paid." };

// 	} else if (isNaN(paidField.value) || Number.isNaN(Number(paidField.value))
// 		|| Number(paidField.value) < 0 || Number(paidField.value) > subtotalAmount) {

// 		return { isValid: false, message: "Please enter a valid amount paid." };

// 	}
// 	return { isValid: true };
// }

// function setupChangeAndDue() {
// 	const subtotalElement = document.getElementById("order-subtotal-display");
// 	const subtotalAmount = Number(subtotalElement ? subtotalElement.textContent : 0);
// 	const paidField = document.getElementById("cash-input");
// 	const balanceField = document.getElementById("balance-display");
// 	const balanceLabel = document.getElementById("balance-label");

// 	if (isNaN(paidField.value)) {
// 		paidField.value = `${(0).toFixed(2)}`;
// 		balanceField.value = subtotalAmount.toFixed(2);
// 		return;
// 	}
// 	if (paidField.value.trim() === "") {
// 		balanceField.value = subtotalAmount.toFixed(2);
// 	} else if (paidField.value < subtotalAmount) {
// 		balanceField.value = (subtotalAmount - Number(paidField.value)).toFixed(2);
// 		if (balanceLabel) {
// 			balanceLabel.textContent = "Due:";
// 			balanceLabel.style.color = "red";
// 		}

// 	} else {
// 		const paidAmount = Number(paidField.value);
// 		const changeDue = paidAmount - subtotalAmount;
// 		balanceField.value = changeDue.toFixed(2);
// 		if (balanceLabel) {
// 			balanceLabel.textContent = "Change:";
// 			balanceLabel.style.color = "green";
// 		}
// 	}
// }


// function isdiscountFieldValid() {
// 	const discountPreField = document.getElementById("discount-input");

// 	if (!discountPreField) {
// 		return { isValid: false };
// 	}
// 	if (discountPreField.value.trim() === "" || discountPreField.value === null) {
// 		return { isValid: true };
// 	} else if (!/^\d+(\.\d+)?$/.test(discountPreField.value)) {
// 		return { isValid: false };
// 	} else if (Number.isNaN(Number(discountPreField.value)) || Number(discountPreField.value) < 0 || Number(discountPreField.value) > 100) {
// 		return { isValid: false };
// 	} else {
// 		return { isValid: true };
// 	}
// }

// function isPaidFieldValid() {
// 	const paidField = document.getElementById("cash-input");
// 	const subtotalElement = document.getElementById("order-subtotal-display");
// 	const subtotalAmount = Number(subtotalElement ? subtotalElement.textContent : 0);
// 	if (paidField.value.trim() === "" || paidField.value === null) {
// 		return { isValid: false };
// 	} else if (Number.isNaN(Number(paidField.value)) || Number(paidField.value) < 0 || Number(paidField.value) > subtotalAmount) {
// 		return { isValid: false };
// 	} else if (isNaN(paidField.value)) {
// 		return { isValid: false };
// 	} else {
// 		return { isValid: true };
// 	}
// }


// function showDiscountFieldError() {
// 	const discountPreField = document.getElementById("discount-input");
// 	const discountErrorLabel = document.getElementById("discount-error-label");
// 	if (discountErrorLabel) {
// 		discountErrorLabel.textContent = "Please enter a valid discount amount (0%-100%).";
// 		discountErrorLabel.style.color = "red";
// 		discountErrorLabel.classList.remove("hidden");
// 	}
// 	if (discountPreField) {
// 		discountPreField.classList.add("input-error");
// 		discountPreField.style.borderColor = "red";
// 	}
// }

// function hideDiscountFieldError() {
// 	const discountPreField = document.getElementById("discount-input");
// 	const discountErrorLabel = document.getElementById("discount-error-label");
// 	if (discountErrorLabel) {
// 		discountErrorLabel.textContent = "";
// 		discountErrorLabel.style.color = "";
// 		discountErrorLabel.classList.add("hidden");
// 	}
// 	if (discountPreField) {
// 		discountPreField.classList.remove("input-error");
// 		discountPreField.style.borderColor = "";
// 	}
// }

// function showPaidFieldError() {
// 	const paidField = document.getElementById("cash-input");
// 	const paidErrorLabel = document.getElementById("cash-error-label");
// 	if (paidErrorLabel) {
// 		paidErrorLabel.textContent = "Please enter a valid amount paid.";
// 		paidErrorLabel.style.color = "red";
// 		paidErrorLabel.classList.remove("hidden");
// 	}
// 	if (paidField) {
// 		paidField.classList.add("input-error");
// 		paidField.style.borderColor = "red";
// 	}
// }

// function hidePaidFieldError() {
// 	const paidField = document.getElementById("cash-input");
// 	const paidErrorLabel = document.getElementById("cash-error-label");
// 	if (paidErrorLabel) {
// 		paidErrorLabel.textContent = "";
// 		paidErrorLabel.style.color = "";
// 		paidErrorLabel.classList.add("hidden");
// 	}
// 	if (paidField) {
// 		paidField.classList.remove("input-error");
// 		paidField.style.borderColor = "";
// 	}
// }

// /* ----------------------------------------------------------------------------------------------
// 								   Order History Management Logic
//    ----------------------------------------------------------------------------------------------*/
// const historyFilteredOrders = [];
// if(historyFilteredOrders.length === 0){
// 	historyFilteredOrders.push(...ordersList);
// }

// function loadOrderHistory(orders = ordersList) {
// 	const historyTableBody = document.querySelector("#history-table-body");
// 	if (!historyTableBody) {
// 		return;
// 	}
// 	if (orders.length === 0) {
// 		historyTableBody.innerHTML = "<tr><td colspan='5'>No orders found.</td></tr>";
// 		return;
// 	}
// 	historyTableBody.innerHTML = "";
// 	orders.forEach((order) => {
// 		const customer = customersList.find(c => c.id === order.customerId);
// 		const discountAmount = Number(order.discount) ? (Number(order.total) * (Number(order.discount) / 100)) : 0;
// 		const subtotal = Number(order.total) - discountAmount;
// 		const row = document.createElement("tr");
// 		row.innerHTML = `
// 			<td>${order.id}</td>
// 			<td>${customer ? customer.name : "Walk-in Customer"}</td>
// 			<td>${order.date}</td>
// 			<td>Rs ${Number(order.total).toFixed(2)}</td>
// 			<td>Rs ${discountAmount.toFixed(2)}</td>
// 			<td>Rs ${subtotal.toFixed(2)}</td>
// 			<td>Rs ${Number(order.paid).toFixed(2)}</td>
// 		`;
// 		historyTableBody.appendChild(row);
// 	});
// }

// function resetOrderHistory() {
// 	const searchInput = document.getElementById("history-search");
// 	const startDateInput = document.getElementById("start-date");
// 	const endDateInput = document.getElementById("end-date");

// 	if (startDateInput) {
// 		startDateInput.value = "";
// 	}	
// 	if (endDateInput) {
// 		const today = new Date();
// 		endDateInput.value = today.toISOString().split("T")[0];
// 	}
// 	if (searchInput) {
// 		searchInput.value = "";
// 	}
// 	historyFilteredOrders.length = 0;
// 	historyFilteredOrders.push(...ordersList);
// 	loadOrderHistory();
	
// }

// // Search Orders in History
// document.getElementById("history-search").addEventListener("input", function () {
// 	const query = this.value.toLowerCase().trim();
// 	const tableBody = document.querySelector("#history-table-body");
// 	if (!query) {
// 		loadOrderHistory();
// 		return;
// 	}
// 	const filtered = historyFilteredOrders.filter(order => {
// 		const customer = customersList.find(c => c.id === order.customerId);
// 		const customerName = customer ? customer.name.toLowerCase() : "walk-in customer";
// 		return (
// 			order.id.toLowerCase().includes(query) ||
// 			customerName.includes(query) ||
// 			order.date.includes(query)
// 		);
// 	});
// 	if (filtered.length === 0) {
// 		tableBody.innerHTML = "<tr><td colspan='5'>No orders found.</td></tr>";
// 	} else {
// 		tableBody.innerHTML = "";
// 		loadOrderHistory(filtered);
// 	}
// });

// // Filter Orders by Date Range
// document.querySelectorAll(".filter-by-date").forEach((input) => {
// 	const applyDateRangeFilter = () => {
// 		let startDate = document.getElementById("start-date").value;
// 		let endDate = document.getElementById("end-date").value;

// 		if (!startDate && !endDate) {
// 			loadOrderHistory();
// 			return;
// 		}

// 		const filtered = ordersList.filter((order) => {
// 			const orderDate = String(order.date || "");
// 			return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
// 		});
// 		historyFilteredOrders.length = 0;
// 		historyFilteredOrders.push(...filtered);
// 		document.getElementById("history-search").value = "";
// 		loadOrderHistory(filtered);
// 	};

// 	input.addEventListener("input", applyDateRangeFilter);
// 	input.addEventListener("change", applyDateRangeFilter);
// });


// document.addEventListener("click", (event) => {
// 	if (event.target.tagName === "TD" && event.target.parentElement.parentElement.id === "history-table-body") {
// 		const cells = event.target.parentElement.children;
// 		const orderId = cells[0].textContent.trim();
// 		const order = ordersList.find(o => o.id === orderId);
// 		if (order) {
// 			document.getElementById("order-id-display").value = order.id;
// 			document.getElementById("order-date").value = order.date;

// 			const customer = customersList.find(c => c.id === order.customerId);
// 			document.getElementById("order-cust-id").value = customer ? customer.id : "----";
// 			document.getElementById("order-cust-name").value = customer ? customer.name : "Walk-in Customer";
// 			document.getElementById("order-cust-phone").value = customer ? customer.phone : "----";
// 			document.getElementById("order-cust-address").value = customer ? customer.address : "----";
// 			document.getElementById("discount-input").value = order.discount;
// 			document.getElementById("cash-input").value = `${(0).toFixed(2)}`;

// 			itemCartList.length = 0;
// 			order.orderDetails.forEach(detail => {
// 				itemCartList.push({ itemId: detail.itemId, qty: detail.qty });
// 			});
// 			loadCartTable();
// 			calculateOrderTotals();
// 			showOrderUpdateButton();
// 			navigateToOrderFromHistory();
// 		}
// 	}
// });

// // navidate to order
// function navigateToOrderFromHistory() {
// 	const orderId = document.getElementById("order-id-display").value.trim();
// 	if (orderId === "") {
// 		alert("Please select an order from the history table first.");
// 		return;
// 	}
// 	const order = ordersList.find(o => o.id === orderId);
// 	if (!order) {
// 		alert("Selected order not found.");
// 		return;
// 	}

// 	navLinks.forEach((link) => {
// 		const isOrdersLink = link.getAttribute("data-target") === "orders";
// 		link.classList.toggle("active", isOrdersLink);
// 	});

// 	pages.forEach((page) => {
// 		const isOrdersPage = page.id === "orders";
// 		page.classList.toggle("active", isOrdersPage);
// 		page.classList.toggle("hidden", !isOrdersPage);
// 	});
// }

// function showOrderUpdateButton() {
// 	const orderUpdateButtons = document.getElementById("order-update-btns");
// 	const orderSubmitButtons = document.querySelector(".summary-btns");
// 	const orderDueDisplay = document.getElementById("order-paid-amount");

// 	if (orderUpdateButtons && orderSubmitButtons) {
// 		orderUpdateButtons.classList.remove("hidden");
// 		orderDueDisplay.classList.remove("hidden");
// 		orderSubmitButtons.classList.add("hidden");
// 	}
// }

// function hideOrderUpdateButton() {
// 	const orderUpdateButtons = document.getElementById("order-update-btns");
// 	const orderSubmitButtons = document.querySelector(".summary-btns");
// 	const orderDueDisplay = document.getElementById("order-paid-amount");
// 	if (orderUpdateButtons && orderSubmitButtons) {
// 		orderUpdateButtons.classList.add("hidden");
// 		orderDueDisplay.classList.add("hidden");
// 		orderSubmitButtons.classList.remove("hidden");
// 	}
// }
