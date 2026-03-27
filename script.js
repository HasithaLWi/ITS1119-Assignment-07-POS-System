const THEME_KEY = "pos-theme";
const ACCENT_KEY = "pos-accent";

const customersList = []; // Global array to store customers
customersList.push({id: "CUS-001", name: "Customer one", phone: "0784561231", address: "Galle"}); // Sample customer for testing
const itemsList = []; // Global array to store items
itemsList.push({ id: "ITM-001", name: "Item one", price: 5000, qty: 10 });

let selectedItemId = null;

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
	getAllCustomers();
	getAllItems();
});

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
	}else if (username !== "admin") {
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

	// getAllCustomers(); // Load customers immediately after login
});

// --- Navigation Logic ---
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');
        
        // Toggle Active Link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Toggle Active Section
        pages.forEach(p => {
            p.classList.remove('active');
			p.classList.add('hidden');
            if(p.id === target){
				p.classList.add('active');
				p.classList.remove('hidden');
			} 
        });

		if (target === 'customers') {
			getAllCustomers(customersList);
			console.log('Navigated to customers page');
		}

		if (target === 'items') {
			getAllItems();
		}
    });
});


// 4. Update the Dashboard Number
function updateDashboardStats() {
    const statCustomers = document.getElementById('stat-customers-count');
    const statItems = document.getElementById('stat-items-count');
    if (statCustomers) {
		statCustomers.textContent = customersList.length;
    }
	if (statItems) {
		statItems.textContent = itemsList.length;
	}
}

function formatCustomerId(id) {
	return `CUS-${String(id).padStart(3, "0")}`;
}

function formatItemCode(id) {
	return `ITM-${String(id).padStart(3, "0")}`;
}

function getNextItemId() {
	if (itemsList.length === 0) {
		return 1;
	}

	return Math.max(...itemsList.map((item) => item.id)) + 1;
}


/* ----------------------------------------------------------------------------------------------
                                Customers Management Logic
   ----------------------------------------------------------------------------------------------*/

// 5. Fetch Customers from Local Storage
function getAllCustomers(customers = customersList) {
	const customersTableBody = document.querySelector("#customers-table-body");
	if (!customersTableBody) {
		return;
	}
	if (customers.length === 0) {
		customersTableBody.innerHTML = "<tr><td colspan='5'>No customers found.</td></tr>";
		return;
	}else {
		customersTableBody.innerHTML = "";
		customers.forEach((customer, index) => {
			const row = document.createElement("tr");
			const customerId = customer.id || (index + 1);
			row.innerHTML = `
				<td>${customerId}</td>
				<td>${customer.name}</td>
				<td>${customer.phone}</td>
				<td>${customer.address}</td>
				<td><button class="buttons customer-buttons btn-delete customer-delete-btn" data-index="${index}">Delete</button>
				</td>
			`;
			customersTableBody.appendChild(row);
		});
	}	
}

// 6. Save Customer
function saveCustomer() {
	const nameInput = document.getElementById("cust-name-input");
	const phoneInput = document.getElementById("cust-phone-input");
	const addressInput = document.getElementById("cust-address-input");
	const name = nameInput.value.trim();
	const phone = phoneInput.value.trim();
	const address = addressInput.value.trim();

	
	const validation = isCustomerFormValid(false); // Perform duplicate phone check for new customers
	if (!validation.isValid) {
		alert(validation.message);
		return;
	}
	const newCustomerId = formatCustomerId(customersList.length + 1);
	const newCustomer = { id: newCustomerId, name, phone, address };
	customersList.push(newCustomer);
	updateDashboardStats();
	getAllCustomers();
	resetCustomerpage();
}

// 7. Delete Customer
document.addEventListener("click", (event) => {
	if (event.target.classList.contains("customer-delete-btn")) {
		if (!confirm("Are you sure you want to delete this customer?")) {
			return;
		}	
		const index = event.target.dataset.index;
		if (index !== undefined) {
			customersList.splice(index, 1);
			updateDashboardStats();
			getAllCustomers();
		}
	}
});

// 8. Update Customer
function updateCustomer() {
	const idInput = document.getElementById("cust-id-input");
	const nameInput = document.getElementById("cust-name-input");
	const phoneInput = document.getElementById("cust-phone-input");
	const addressInput = document.getElementById("cust-address-input");
	const id = idInput.value.trim();
	const name = nameInput.value.trim();
	const phone = phoneInput.value.trim();
	const address = addressInput.value.trim();

	if (id === "") {
		alert("Please select a customer first.");
		return;
	}
	const validation = isCustomerFormValid(true); // Skip duplicate phone check for updates
	if (!validation.isValid) {
		alert(validation.message);
		return;
	}
	const index = customersList.findIndex(c => c.id === id);// Find customer by formatted ID
	if (index >= 0 && index < customersList.length) {
		customersList[index] = { ...customersList[index], name, phone, address };
		updateDashboardStats();
		getAllCustomers();
		idInput.value = "";
		nameInput.value = "";
		phoneInput.value = "";
		addressInput.value = "";
	} else {
		alert("Invalid Customer ID.");
	}	
}

// 9. Reset Customer Form
function resetCustomerpage() {
	document.getElementById("cust-id-input").value = "";
	document.getElementById("cust-name-input").value = "";
	document.getElementById("cust-phone-input").value = "";
	document.getElementById("cust-address-input").value = "";
	document.getElementById("customer-search").value = "";
	getAllCustomers();
}

//10. select customer from table to form
document.addEventListener("click", (event) => {
	if (event.target.tagName === "TD" && event.target.parentElement.parentElement.id === "customers-table-body") {
		const cells = event.target.parentElement.children;
		document.getElementById("cust-id-input").value = cells[0].textContent;
		document.getElementById("cust-name-input").value = cells[1].textContent;
		document.getElementById("cust-phone-input").value = cells[2].textContent;
		document.getElementById("cust-address-input").value = cells[3].textContent;
	}	
});

// 11. Validate Customer Form
function isCustomerFormValid(skipDuplicateCheck = false) {
	const nameInput = document.getElementById("cust-name-input");
	const phoneInput = document.getElementById("cust-phone-input");
	const addressInput = document.getElementById("cust-address-input");
	const name = nameInput.value.trim();
	const phone = phoneInput.value.trim();
	const address = addressInput.value.trim();

	if (name === "" || phone === "" || address === "") {
		return { isValid: false, message: "Please fill in all fields." };
	}

	if (!/^[a-zA-Z\s]{3,50}$/.test(name)) {
		return { isValid: false, message: "Name must contain only letters and spaces (3-50 characters)." };
	}

	if (!/^\d{10}$/.test(phone)) {
		return { isValid: false, message: "Phone must be exactly 10 digits." };
	} else if (!skipDuplicateCheck) {
		const existingCustomer = customersList.find(c => c.phone === phone);	
		if (existingCustomer) {
			return { isValid: false, message: "Phone number already exists." };
		}
	}

	if (address.length < 3) {
		return { isValid: false, message: "Address must be at least 3 characters." };
	}

	return { isValid: true, message: "" };
}

// 12. Search Customers
document.getElementById("customer-search").addEventListener("input", function() {
    const query = this.value.toLowerCase().trim();
    const tableBody = document.querySelector("#customers-table-body");

    // 1. If search is empty, show everyone and stop
    if (!query) {
        getAllCustomers(customersList);
        return;
    }

    // 2. The "Easy" Filter: Check all properties at once
    const filtered = customersList.filter(customer => 
        Object.values(customer).some(val => 
            String(val).toLowerCase().includes(query)
        )
    );

    // 3. Update the UI
    if (filtered.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='5'>No customers found.</td></tr>";
    } else {
        tableBody.innerHTML = ""; // Clear table
        getAllCustomers(filtered); // Reuse your existing render function
    }
});

/* ----------------------------------------------------------------------------------------------
                                   Items Management Logic
   ----------------------------------------------------------------------------------------------*/

function getAllItems(items = itemsList) {
	const itemsTableBody = document.querySelector("#items-table-body");
	if (!itemsTableBody) {
		return;
	}

	if (items.length === 0) {
		itemsTableBody.innerHTML = "<tr><td colspan='5'>No items found.</td></tr>";
		return;
	}

	itemsTableBody.innerHTML = "";
	items.forEach((item) => {
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${item.id}</td>
			<td>${item.name}</td>
			<td>${item.price}</td>
			<td>${item.qty}</td>
			<td><button class="buttons item-buttons btn-delete item-delete-btn" data-id="${item.id}">Delete</button></td>
		`;
		itemsTableBody.appendChild(row);
	});
}

function isItemFormValid() {
	const itemNameInput = document.getElementById("item-name-input");
	const itemPriceInput = document.getElementById("item-price-input");
	const itemQtyInput = document.getElementById("item-qty-input");

	const name = itemNameInput.value.trim();
	const price = Number(itemPriceInput.value);
	const qty = Number(itemQtyInput.value);

	if (name === "" || itemPriceInput.value.trim() === "" || itemQtyInput.value.trim() === "") {
		return { isValid: false, message: "Please fill in all item fields." };
	}

	if (!/^[a-zA-Z0-9\s]{2,60}$/.test(name)) {
		return { isValid: false, message: "Item name must be 2-60 characters (letters, numbers, spaces)." };
	}

	if (Number.isNaN(price) || price <= 0) {
		return { isValid: false, message: "Price must be greater than 0." };
	}

	if (!Number.isInteger(qty) || qty < 0) {
		return { isValid: false, message: "Stock quantity must be 0 or more." };
	}

	return { isValid: true, message: "" };
}

function saveItem() {
	const validation = isItemFormValid();
	if (!validation.isValid) {
		alert(validation.message);
		return;
	}

	const name = document.getElementById("item-name-input").value.trim();
	const price = Number(document.getElementById("item-price-input").value);
	const qty = Number(document.getElementById("item-qty-input").value);
	const newItemId = formatItemCode(getNextItemId());

	itemsList.push({
		id: newItemId,
		name,
		price,
		qty
	});

	updateDashboardStats();
	getAllItems();
	resetItemPage();
}

function updateItem() {
	if (selectedItemId === null) {
		alert("Please select an item first.");
		return;
	}

	const validation = isItemFormValid();
	if (!validation.isValid) {
		alert(validation.message);
		return;
	}

	const index = itemsList.findIndex((item) => item.id === selectedItemId);
	if (index === -1) {
		alert("Invalid item code.");
		return;
	}

	itemsList[index] = {
		...itemsList[index],
		name: document.getElementById("item-name-input").value.trim(),
		price: Number(document.getElementById("item-price-input").value),
		qty: Number(document.getElementById("item-qty-input").value)
	};

	updateDashboardStats();
	getAllItems();
	resetItemPage();
}

function resetItemPage() {
	document.getElementById("item-name-input").value = "";
	document.getElementById("item-price-input").value = "";
	document.getElementById("item-qty-input").value = "";
	document.getElementById("item-search").value = "";
	selectedItemId = null;
	getAllItems();
}

document.addEventListener("click", (event) => {
	if (event.target.classList.contains("item-delete-btn")) {
		if (!confirm("Are you sure you want to delete this item?")) {
			return;
		}

		const id = Number(event.target.dataset.id);
		const index = itemsList.findIndex((item) => item.id === id);
		if (index !== -1) {
			itemsList.splice(index, 1);
			updateDashboardStats();
			getAllItems();
			if (selectedItemId === id) {
				resetItemPage();
			}
		}
	}
});

document.addEventListener("click", (event) => {
	if (event.target.tagName === "TD" && event.target.parentElement.parentElement.id === "items-table-body") {
		const cells = event.target.parentElement.children;

		selectedItemId = cells[0].textContent.trim();

		document.getElementById("item-code-input").value = cells[0].textContent.trim();
		document.getElementById("item-name-input").value = cells[1].textContent.trim();
		document.getElementById("item-price-input").value = cells[2].textContent.trim();
		document.getElementById("item-qty-input").value = cells[3].textContent.trim();
	}
});

const saveItemButton = document.getElementById("save-item");
const updateItemButton = document.getElementById("update-item");
const resetItemButton = document.getElementById("reset-item");

const itemSearchInput = document.getElementById("item-search");
if (itemSearchInput) {
	itemSearchInput.addEventListener("input", function () {
		const query = this.value.toLowerCase().trim();

		if (!query) {
			getAllItems(itemsList);
			return;
		}

		const filteredItems = itemsList.filter((item) => {
			const code = formatItemCode(item.id).toLowerCase();
			return (
				code.includes(query) ||
				item.name.toLowerCase().includes(query) ||
				String(item.price).includes(query) ||
				String(item.qty).includes(query)
			);
		});

		getAllItems(filteredItems);
	});
}

   

	

