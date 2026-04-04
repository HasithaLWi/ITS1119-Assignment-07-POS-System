
const customerModelInstance = new customerModel();
let customerDataList = [];


function loadCustomers() {
	customerDataList = customerModelInstance.getAllCustomers().customers;
}


// Fetch Customers from Local Storage
function loadCustomerTable(customerData = customerDataList) {
	const customersTableBody = document.querySelector("#customers-table-body");
	if (!customersTableBody) {
		return;
	}
	if (customerModelInstance.getAllCustomers().isEmpty) {
		customersTableBody.innerHTML = "<tr><td colspan='5'>No customers found.</td></tr>";
		return;
	} else {
		customersTableBody.innerHTML = "";
		customerData.forEach((customer, index) => {
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

// Save Customer
function saveCustomer() {
	const nameInput = document.getElementById("cust-name-input");
	const phoneInput = document.getElementById("cust-phone-input");
	const addressInput = document.getElementById("cust-address-input");
	const name = nameInput.value.trim();
	const phone = phoneInput.value.trim();
	const address = addressInput.value.trim();


	const validation = isCustomerFormValid(false);
	if (!validation.isValid) {
		alert(validation.message);
		return;
	}
	const newCustomerId = generateNewCustomerId();
	const newCustomer = new Customer(newCustomerId, name, phone, address);

	// customersList.push(newCustomer);
	customerModelInstance.saveCustomer(newCustomer);

	updateDashboardStats();
	resetCustomerpage();
}

// Delete Customer
document.addEventListener("click", (event) => {
	if (event.target.classList.contains("customer-delete-btn")) {
		if (!confirm("Are you sure you want to delete this customer?")) {
			return;
		}
		const index = event.target.dataset.index;
		if (index !== undefined) {
			customerDataList.forEach((customer, i) => {
				if (i == index) {
					customerModelInstance.deleteCustomer(customer.id);
					
					return;
				}
			});

			console.log("Customer deleted:", customerDataList[index]);
			loadCustomers();
			updateDashboardStats();
			loadCustomerTable();
		}
	}
});

// Update Customer
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
	const validation = isCustomerFormValid(true);
	if (!validation.isValid) {
		alert(validation.message);
		return;
	}

	customerModelInstance.updateCustomer(new Customer(id, name, phone, address));

	updateDashboardStats();
	resetCustomerpage();

	alert("Customer updated successfully.");

}

//select customer from table to form
document.addEventListener("click", (event) => {
	if (event.target.tagName === "TD" && event.target.parentElement.parentElement.id === "customers-table-body") {
		const cells = event.target.parentElement.children;
		document.getElementById("cust-id-input").value = cells[0].textContent;
		document.getElementById("cust-name-input").value = cells[1].textContent;
		document.getElementById("cust-phone-input").value = cells[2].textContent;
		document.getElementById("cust-address-input").value = cells[3].textContent;
	}
});

// Search Customers
document.getElementById("customer-search").addEventListener("input", function () {
	const query = this.value.toLowerCase().trim();
	const tableBody = document.querySelector("#customers-table-body");

	if (!query) {
		loadCustomerTable(customerDataList);
		return;
	}

	const filtered = customerDataList.filter(customer =>
		Object.values(customer).some(val =>
			String(val).toLowerCase().includes(query)
		)
	);

	if (filtered.length === 0) {
		tableBody.innerHTML = "<tr><td colspan='5'>No customers found.</td></tr>";
	} else {
		tableBody.innerHTML = "";
		loadCustomerTable(filtered);
	}
});

// Validate Customer Form
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
		const existingCustomer = customerDataList.find(c => c.phone === phone);
		if (existingCustomer) {
			return { isValid: false, message: "Phone number already exists." };
		}
	}

	if (address.length < 3) {
		return { isValid: false, message: "Address must be at least 3 characters." };
	}

	return { isValid: true, message: "" };
}

// Reset Customer Form
function resetCustomerpage() {
	document.getElementById("cust-id-input").value = "";
	document.getElementById("cust-name-input").value = "";
	document.getElementById("cust-phone-input").value = "";
	document.getElementById("cust-address-input").value = "";
	document.getElementById("customer-search").value = "";
	loadCustomers();
	loadCustomerTable();
}