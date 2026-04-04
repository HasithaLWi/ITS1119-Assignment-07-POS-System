

/* ----------------------------------------------------------------------------------------------
								   Items Management Logic
   ----------------------------------------------------------------------------------------------*/

let selectedItemId = null;

// Fetch Items from Local Storage
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
	items.forEach((item, index) => {
		const row = document.createElement("tr");
		const itemId = item.id || (index + 1);
		row.innerHTML = `
			<td>${itemId}</td>
			<td>${item.name}</td>
			<td>${item.price}</td>
			<td>${item.qty}</td>
			<td><button class="buttons item-buttons btn-delete item-delete-btn" data-index="${index}">Delete</button></td>
		`;
		itemsTableBody.appendChild(row);
	});
}

// Validate Item Form
function isItemFormValid() {
	const itemNameInput = document.getElementById("item-name-input");
	const itemPriceInput = document.getElementById("item-price-input");
	const itemQtyInput = document.getElementById("item-qty-input");

	const name = itemNameInput.value.trim();
	const price = Number(itemPriceInput.value);
	const qty = Number(itemQtyInput.value);
	if (isNaN(itemPriceInput.value) || itemPriceInput.value.trim() === "") {
		return { isValid: false, message: "Please enter a valid price." };
	}
	if (isNaN(itemQtyInput.value) || itemQtyInput.value.trim() === "") {
		return { isValid: false, message: "Please enter a valid stock quantity." };
	}

	if (name === "" || itemPriceInput.value.trim() === "" || itemQtyInput.value.trim() === "") {
		return { isValid: false, message: "Please fill in all item fields." };
	}

	if (!/^[a-zA-Z0-9\s]{2,60}$/.test(name)) {
		return { isValid: false, message: "Item name must be 2-60 characters (letters, numbers, spaces)." };
	}

	if (Number.isNaN(price) || price <= 0) {
		return { isValid: false, message: "Price must be greater than 0." };
	}

	if (Number.isNaN(qty) || !Number.isInteger(qty) || qty < 0) {
		return { isValid: false, message: "Stock quantity must be a non-negative integer." };
	}

	return { isValid: true, message: "" };
}

// Save Item
function saveItem() {
	const validation = isItemFormValid();
	if (!validation.isValid) {
		alert(validation.message);
		return;
	}

	const name = document.getElementById("item-name-input").value.trim();
	const price = Number(document.getElementById("item-price-input").value);
	const qty = Number(document.getElementById("item-qty-input").value);
	const newItemId = generateNewItemCode();

	itemsList.push({
		id: newItemId,
		name,
		price,
		qty
	});

	updateDashboardStats();
	resetItemPage();
}

// Update Item
function updateItem() {
	const itemCodeInput = document.getElementById("item-code-input");
	const itemNameInput = document.getElementById("item-name-input");
	const itemPriceInput = document.getElementById("item-price-input");
	const itemQtyInput = document.getElementById("item-qty-input");

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
	if (index < 0 || index >= itemsList.length) {
		alert("Invalid item code.");
		return;
	}

	itemsList[index] = {
		...itemsList[index],
		name: itemNameInput.value.trim(),
		price: Number(itemPriceInput.value),
		qty: Number(itemQtyInput.value)
	};

	updateDashboardStats();
	resetItemPage();
}

// Reset Item Form
function resetItemPage() {
	document.getElementById("item-code-input").value = "";
	document.getElementById("item-name-input").value = "";
	document.getElementById("item-price-input").value = "";
	document.getElementById("item-qty-input").value = "";
	document.getElementById("item-search").value = "";
	selectedItemId = null;
	getAllItems();
}


// Delete Item
document.addEventListener("click", (event) => {
	if (event.target.classList.contains("item-delete-btn")) {
		if (!confirm("Are you sure you want to delete this item?")) {
			return;
		}

		const index = event.target.dataset.index;
		if (index !== undefined) {
			itemsList.splice(index, 1);
			updateDashboardStats();
			getAllItems();
		}
	}
});

// Select item from table to form
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


// Search Items
document.getElementById("item-search").addEventListener("input", function () {
	const query = this.value.toLowerCase().trim();
	const tableBody = document.querySelector("#items-table-body");


	if (!query) {
		getAllItems(itemsList);
		return;
	}


	const filtered = itemsList.filter(item =>
		Object.values(item).some(val =>
			String(val).toLowerCase().includes(query)
		)
	);


	if (filtered.length === 0) {
		tableBody.innerHTML = "<tr><td colspan='5'>No items found.</td></tr>";
	} else {
		tableBody.innerHTML = "";
		getAllItems(filtered);
	}
});