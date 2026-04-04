

/* ----------------------------------------------------------------------------------------------
								   Orders Management Logic
   ----------------------------------------------------------------------------------------------*/
const customerSelector = document.getElementById("order-customer-select");
const itemSelector = document.getElementById("order-item-select");

function setupDateAndOrderId() {

	// Generate new order ID and set to order form
	const newOrderId = generateNewOrderId();
	document.getElementById("order-id-display").value = newOrderId;

	// Set today's date to order form
	const orderDateInput = document.getElementById("order-date");
	const today = new Date().toISOString().split("T")[0];
	if (orderDateInput) {
		orderDateInput.value = today;
	}
}


function loadOrderPage() {

	setupDateAndOrderId();


	// Populate customer dropdown in order form
	customerSelector.innerHTML = "";


	const existingCustomerOption = document.createElement("option");
	existingCustomerOption.value = "";
	existingCustomerOption.textContent = "Select Customer";
	customerSelector.appendChild(existingCustomerOption);

	const optionDefault = document.createElement("option");
	optionDefault.value = "";
	optionDefault.textContent = "Select None";
	customerSelector.appendChild(optionDefault);

	customerDB.forEach(customer => {
		const option = document.createElement("option");
		option.value = customer.id;
		option.textContent = `${customer.name} (${customer.id})`;
		customerSelector.appendChild(option);
	});

	// Populate item dropdown in order form
	itemSelector.innerHTML = "";

	const itemOptionDefault = document.createElement("option");
	itemOptionDefault.value = "";
	itemOptionDefault.textContent = "Select Item";
	itemSelector.appendChild(itemOptionDefault);

	itemsList.forEach(item => {
		const option = document.createElement("option");
		option.value = item.id;
		option.textContent = `${item.name} (${item.id})`;
		itemSelector.appendChild(option);
	});
}


// load cart items
function loadCartTable() {
	const cartTableBody = document.querySelector("#cart-table-body");
	if (!cartTableBody) {
		return;
	}
	cartTableBody.innerHTML = "";
	itemCartList.forEach((detail, index) => {
		const item = itemsList.find(i => i.id === detail.itemId);
		if (item) {
			const row = document.createElement("tr");
			row.innerHTML = `
				<td>${item.id}</td>
				<td>${item.name}</td>
				<td>${item.price}</td>
				<td>${detail.qty}</td>
				<td>${item.price * detail.qty}</td>
				<td><button class="buttons order-buttons btn-delete cart-item-delete-btn" data-index="${index}">-</button></td>	
			`;
			cartTableBody.appendChild(row);
		}
	});
}

// Select customer for order
customerSelector.addEventListener("change", selectCustomerForOrder);

function selectCustomerForOrder() {
	const customerIdInput = document.getElementById("order-cust-id");
	const customerNameInput = document.getElementById("order-cust-name");
	const customerPhoneInput = document.getElementById("order-cust-phone");
	const customerAddressInput = document.getElementById("order-cust-address");

	const selectedCustomer = document.getElementById("order-customer-select").value;
	if (selectedCustomer === "") {
		customerIdInput.value = "----";
		customerNameInput.value = "Walk-in Customer";
		customerPhoneInput.value = "----";
		customerAddressInput.value = "----";
		return;
	}
	const customer = customerDB.find(c => c.id === selectedCustomer);
	if (customer) {
		customerIdInput.value = customer.id;
		customerNameInput.value = customer.name;
		customerPhoneInput.value = customer.phone;
		customerAddressInput.value = customer.address;
	} else {
		alert("Selected customer not found.");
	}
}

itemSelector.addEventListener("change", selectItemForOrder);

function selectItemForOrder() {

	const itemIdInput = document.getElementById("order-item-code");
	const itemNameInput = document.getElementById("order-item-name");
	const itemPriceInput = document.getElementById("order-item-price");
	const itemQtyInput = document.getElementById("order-item-qty-on-hand");

	const selectedItemId = document.getElementById("order-item-select").value;
	if (selectedItemId === "") {
		itemIdInput.value = "";
		itemNameInput.value = "";
		itemPriceInput.value = "";
		itemQtyInput.value = "";
		return;

	}
	const item = itemsList.find(i => i.id === selectedItemId);
	if (item) {
		itemIdInput.value = item.id;
		itemNameInput.value = item.name;
		itemPriceInput.value = item.price;
		itemQtyInput.value = item.qty;
	} else {
		alert("Selected item not found.");
	}
}

// reset order form
function resetOrderForm() {
	document.getElementById("order-id-display").value = "";
	document.getElementById("order-date").value = "";
	document.getElementById("order-cust-id").value = "";
	document.getElementById("order-cust-name").value = "";
	document.getElementById("order-cust-phone").value = "";
	document.getElementById("order-cust-address").value = "";
	document.getElementById("order-item-code").value = "";
	document.getElementById("order-item-name").value = "";
	document.getElementById("order-item-price").value = `${(0).toFixed(2)}`;
	document.getElementById("order-item-qty-on-hand").value = 0;
	document.getElementById("order-customer-select").value = "";
	document.getElementById("order-item-select").value = "";
	document.getElementById("order-item-qty").value = 1;
	document.getElementById("discount-input").value = 0;
	document.getElementById("cash-input").value = `${(0).toFixed(2)}`;
	document.getElementById("balance-display").value = `${(0).toFixed(2)}`;
	document.getElementById("order-total-display").textContent = `${(0).toFixed(2)}`;
	document.getElementById("order-subtotal-display").textContent = `${(0).toFixed(2)}`;
	document.getElementById("balance-label").textContent = "Balance";
	document.getElementById("balance-label").style.color = "";

	itemCartList.length = 0;
	loadCartTable();
	setupDateAndOrderId();
	hideDiscountFieldError();
	hidePaidFieldError();
	hideOrderUpdateButton();
}

function addItemToCart() {
	const itemId = document.getElementById("order-item-code").value.trim();
	const qty = Number(document.getElementById("order-item-qty").value);
	const onHandQty = document.getElementById("order-item-qty-on-hand");

	const isValid = isOrderFormValid();
	if (!isValid.isValid) {
		alert(isValid.message);
		return;
	}

	const existingCartItem = itemCartList.find(i => i.itemId === itemId);

	onHandQty.value -= qty;

	if (existingCartItem) {
		existingCartItem.qty += qty;


	} else {
		itemCartList.push({ itemId, qty });
	}
	loadCartTable();
	calculateOrderTotals();
}

function isOrderFormValid() {
	const itemId = document.getElementById("order-item-code").value.trim();
	const qty = Number(document.getElementById("order-item-qty").value);
	const onHandQty = document.getElementById("order-item-qty-on-hand");

	if (itemId === "" || Number.isNaN(qty) || qty <= 0) {
		return { isValid: false, message: "Please select an item and enter a valid quantity." };
	}
	const item = itemsList.find(i => i.id === itemId);
	if (!item) {
		return { isValid: false, message: "Selected item not found." };
	}
	if (qty > onHandQty.value) {
		return { isValid: false, message: "Requested quantity exceeds available stock." };
	}
	return { isValid: true };
}


let discount = 0;
let paid = 0;
let balance = 0;
let totalDisplay = "0";
let subtotalDisplay = "0";

function calculateOrderTotals() {
	const totalLabel = document.getElementById("order-total-display");
	const subtotalLabel = document.getElementById("order-subtotal-display");
	const discountPreField = document.getElementById("discount-input");
	const paidField = document.getElementById("cash-input");
	const balanceField = document.getElementById("balance-display");




	const total = itemCartList.reduce((sum, cartItem) => {
		const item = itemsList.find(i => i.id === cartItem.itemId);
		return sum + (item ? item.price * cartItem.qty : 0);
	}, 0);

	if (isdiscountFieldValid().isValid) {
		discount = total * (Number(discountPreField.value) / 100);
		hideDiscountFieldError();
	} else {
		showDiscountFieldError();
	}


	if (isPaidFieldValid().isValid) {
		paid = Number(paidField.value);
		hidePaidFieldError();
	} else {
		showPaidFieldError();
	}


	totalDisplay = `${total.toFixed(2)}`;
	subtotalDisplay = `${(total - discount).toFixed(2)}`;
	balance = `${(Number(subtotalDisplay) - Number(paid)).toFixed(2)}`;

	totalLabel.textContent = totalDisplay;
	subtotalLabel.textContent = subtotalDisplay;
	balanceField.value = balance;
	setupChangeAndDue();
}

const cashInputField = document.getElementById("cash-input");
if (cashInputField) {
	cashInputField.addEventListener("input", calculateOrderTotals);
}

const discountInputField = document.getElementById("discount-input");
if (discountInputField) {
	discountInputField.addEventListener("input", calculateOrderTotals);
}



function placeOrder() {

	const newOrderId = generateNewOrderId();
	const customerId = document.getElementById("order-cust-id").value.trim();
	const orderDate = document.getElementById("order-date").value;
	const discountPreField = document.getElementById("discount-input");

	if (itemCartList.length === 0) {
		alert("Please add at least one item to the cart before placing the order.");
		return;
	}



	if (!isPlaceOrderFormValid().isValid) {
		alert(isPlaceOrderFormValid().message);
		return;
	}

	const details = itemCartList.map(cartItem => ({
		orderId: newOrderId,
		itemId: cartItem.itemId,
		qty: cartItem.qty
	}));

	ordersDetailsList.push(...details);

	details.map(detail => {
		const item = itemsList.find(i => i.id === detail.itemId);
		if (item) {
			item.qty -= detail.qty;
		}
	});

	const newOrder = {
		id: newOrderId,
		customerId: customerId === "" ? null : customerId,
		date: orderDate,
		total: totalDisplay,
		discount: discountPreField.value.trim() === "" ? "0" : discountPreField.value,
		paid: paid,
		orderDetails: details
	};


	ordersList.push(newOrder);

	alert("Order placed successfully!");
	updateDashboardStats();
	resetOrderForm();
	resetOrderHistory();
}

function updateOrder() {
	const orderId = document.getElementById("order-id-display").value.trim();
	const customerIdFieldValue = document.getElementById("order-cust-id").value.trim();
	const orderDate = document.getElementById("order-date").value;
	const discountPreField = document.getElementById("discount-input");
	const paidField = document.getElementById("cash-input");

	if (orderId === "") {
		alert("Please select an order to update.");
		return;
	}

	const existingOrder = ordersList.find(order => order.id === orderId);
	if (!existingOrder) {
		alert("Selected order not found.");
		return;
	}

	if (itemCartList.length === 0) {
		alert("Please add at least one item to the cart before updating the order.");
		return;
	}

	const validation = isPlaceOrderFormValid();
	if (!validation.isValid) {
		alert(validation.message);
		return;
	}

	const previousDetails = Array.isArray(existingOrder.orderDetails) ? existingOrder.orderDetails : [];

	// Restore previous stock before checking and applying the updated cart quantities.
	previousDetails.forEach((detail) => {
		const item = itemsList.find(i => i.id === detail.itemId);
		if (item) {
			item.qty += Number(detail.qty);
		}
	});

	const exceedsStock = itemCartList.some((cartItem) => {
		const item = itemsList.find(i => i.id === cartItem.itemId);
		return !item || Number(cartItem.qty) > Number(item.qty);
	});

	if (exceedsStock) {
		previousDetails.forEach((detail) => {
			const item = itemsList.find(i => i.id === detail.itemId);
			if (item) {
				item.qty -= Number(detail.qty);
			}
		});
		alert("Updated item quantity exceeds available stock.");
		return;
	}

	const updatedDetails = itemCartList.map((cartItem) => ({
		orderId,
		itemId: cartItem.itemId,
		qty: Number(cartItem.qty)
	}));

	updatedDetails.forEach((detail) => {
		const item = itemsList.find(i => i.id === detail.itemId);
		if (item) {
			item.qty -= detail.qty;
		}
	});

	for (let i = ordersDetailsList.length - 1; i >= 0; i -= 1) {
		if (ordersDetailsList[i].orderId === orderId) {
			ordersDetailsList.splice(i, 1);
		}
	}
	ordersDetailsList.push(...updatedDetails);

	existingOrder.customerId = (customerIdFieldValue === "" || customerIdFieldValue === "----") ? null : customerIdFieldValue;
	existingOrder.date = orderDate;
	existingOrder.total = totalDisplay;
	existingOrder.discount = discountPreField.value.trim() === "" ? "0" : discountPreField.value.trim();
	existingOrder.paid = Number(paidField.value);
	existingOrder.orderDetails = updatedDetails;

	alert("Order updated successfully!");
	updateDashboardStats();
	resetOrderForm();
	resetOrderHistory();
}

// validate place order form
function isPlaceOrderFormValid() {
	const customerId = document.getElementById("order-cust-id").value.trim();
	const orderDate = document.getElementById("order-date").value;
	const discountPreField = document.getElementById("discount-input");
	const paidField = document.getElementById("cash-input");
	const subtotalElement = document.getElementById("order-subtotal-display");
	const subtotalAmount = Number(subtotalElement ? subtotalElement.textContent : 0);

	if (!discountPreField || !paidField || !subtotalElement) {
		return { isValid: false, message: "Order summary fields are missing." };
	}

	if (!(customerId === "" || customerId === "----" || customerId === null)) {
		if (!customerDB.some(c => c.id === customerId)) {
			return { isValid: false, message: "Selected customer not found." };
		}
	}

	if (orderDate === "" || orderDate === null) {
		return { isValid: false, message: "Please select an order date." };
	}

	if (discountPreField.value.trim() === "" || discountPreField.value === null) {
		discountPreField.value = "0";

	} else if (isNaN(discountInputField.value) || Number.isNaN(Number(discountPreField.value))
		|| Number(discountPreField.value) < 0 || Number(discountPreField.value) > 100) {

		return { isValid: false, message: "Please enter a valid discount amount (0%-100%)." };
	}

	if (paidField.value.trim() === "" || paidField.value === null) {
		return { isValid: false, message: "Please enter the amount paid." };

	} else if (isNaN(paidField.value) || Number.isNaN(Number(paidField.value))
		|| Number(paidField.value) < 0 || Number(paidField.value) > subtotalAmount) {

		return { isValid: false, message: "Please enter a valid amount paid." };

	}
	return { isValid: true };
}

function setupChangeAndDue() {
	const subtotalElement = document.getElementById("order-subtotal-display");
	const subtotalAmount = Number(subtotalElement ? subtotalElement.textContent : 0);
	const paidField = document.getElementById("cash-input");
	const balanceField = document.getElementById("balance-display");
	const balanceLabel = document.getElementById("balance-label");

	if (isNaN(paidField.value)) {
		paidField.value = `${(0).toFixed(2)}`;
		balanceField.value = subtotalAmount.toFixed(2);
		return;
	}
	if (paidField.value.trim() === "") {
		balanceField.value = subtotalAmount.toFixed(2);
	} else if (paidField.value < subtotalAmount) {
		balanceField.value = (subtotalAmount - Number(paidField.value)).toFixed(2);
		if (balanceLabel) {
			balanceLabel.textContent = "Due:";
			balanceLabel.style.color = "red";
		}

	} else {
		const paidAmount = Number(paidField.value);
		const changeDue = paidAmount - subtotalAmount;
		balanceField.value = changeDue.toFixed(2);
		if (balanceLabel) {
			balanceLabel.textContent = "Change:";
			balanceLabel.style.color = "green";
		}
	}
}


function isdiscountFieldValid() {
	const discountPreField = document.getElementById("discount-input");

	if (!discountPreField) {
		return { isValid: false };
	}
	if (discountPreField.value.trim() === "" || discountPreField.value === null) {
		return { isValid: true };
	} else if (!/^\d+(\.\d+)?$/.test(discountPreField.value)) {
		return { isValid: false };
	} else if (Number.isNaN(Number(discountPreField.value)) || Number(discountPreField.value) < 0 || Number(discountPreField.value) > 100) {
		return { isValid: false };
	} else {
		return { isValid: true };
	}
}

function isPaidFieldValid() {
	const paidField = document.getElementById("cash-input");
	const subtotalElement = document.getElementById("order-subtotal-display");
	const subtotalAmount = Number(subtotalElement ? subtotalElement.textContent : 0);
	if (paidField.value.trim() === "" || paidField.value === null) {
		return { isValid: false };
	} else if (Number.isNaN(Number(paidField.value)) || Number(paidField.value) < 0 || Number(paidField.value) > subtotalAmount) {
		return { isValid: false };
	} else if (isNaN(paidField.value)) {
		return { isValid: false };
	} else {
		return { isValid: true };
	}
}


function showDiscountFieldError() {
	const discountPreField = document.getElementById("discount-input");
	const discountErrorLabel = document.getElementById("discount-error-label");
	if (discountErrorLabel) {
		discountErrorLabel.textContent = "Please enter a valid discount amount (0%-100%).";
		discountErrorLabel.style.color = "red";
		discountErrorLabel.classList.remove("hidden");
	}
	if (discountPreField) {
		discountPreField.classList.add("input-error");
		discountPreField.style.borderColor = "red";
	}
}

function hideDiscountFieldError() {
	const discountPreField = document.getElementById("discount-input");
	const discountErrorLabel = document.getElementById("discount-error-label");
	if (discountErrorLabel) {
		discountErrorLabel.textContent = "";
		discountErrorLabel.style.color = "";
		discountErrorLabel.classList.add("hidden");
	}
	if (discountPreField) {
		discountPreField.classList.remove("input-error");
		discountPreField.style.borderColor = "";
	}
}

function showPaidFieldError() {
	const paidField = document.getElementById("cash-input");
	const paidErrorLabel = document.getElementById("cash-error-label");
	if (paidErrorLabel) {
		paidErrorLabel.textContent = "Please enter a valid amount paid.";
		paidErrorLabel.style.color = "red";
		paidErrorLabel.classList.remove("hidden");
	}
	if (paidField) {
		paidField.classList.add("input-error");
		paidField.style.borderColor = "red";
	}
}

function hidePaidFieldError() {
	const paidField = document.getElementById("cash-input");
	const paidErrorLabel = document.getElementById("cash-error-label");
	if (paidErrorLabel) {
		paidErrorLabel.textContent = "";
		paidErrorLabel.style.color = "";
		paidErrorLabel.classList.add("hidden");
	}
	if (paidField) {
		paidField.classList.remove("input-error");
		paidField.style.borderColor = "";
	}
}