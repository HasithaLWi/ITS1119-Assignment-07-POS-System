import { ordersList, customerDB } from "../db/data.js";
import { resetDashboard } from "./dashboardController.js";
import { loadItems, loadItemTable, resetItemPage } from "./itemController.js";
import { resetOrderHistory, hideOrderUpdateButton } from "./orderHistoryController.js";
import { OrderModel } from "../model/orderModel.js";
import { customerModel } from "../model/customerModel.js";
import { ItemModel } from "../model/itemModel.js";
import { CartItem } from "../dto/tm/cartItem.js";
import { Order } from "../dto/order.js";
import { OrderDetails } from "../dto/orderDetails.js";
import { showOrderUpdateButton, navigateToOrderFromHistory } from "./orderHistoryController.js";



const customerModelInstance = new customerModel();
const itemModelInstance = new ItemModel();
const orderModelInstance = new OrderModel();

const itemCartList = [];

let discount = 0;
let paid = 0;
let balance = 0;
let totalDisplay = "0";
let subtotalDisplay = "0";

let customerDataList = customerModelInstance.getAllCustomers();
let itemDataList = itemModelInstance.getAllItems()



const customerSelector = document.getElementById("order-customer-select");
const itemSelector = document.getElementById("order-item-select");

function setupDateAndOrderId() {

	// Generate new order ID and set to order form
	const newOrderId = orderModelInstance.generateNewOrderId();
	document.getElementById("order-id-display").value = newOrderId;

	// Set today's date to order form
	const orderDateInput = document.getElementById("order-date");
	const today = new Date().toISOString().split("T")[0];
	if (orderDateInput) {
		orderDateInput.value = today;
	}
}


export function loadOrderPage() {




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


	customerDataList.customers.forEach(customer => {
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

	itemDataList.items.forEach(item => {
		const option = document.createElement("option");
		option.value = item.id;
		option.textContent = `${item.name} (${item.id})`;
		itemSelector.appendChild(option);
	});
}


// load cart items
export function loadCartTable() {
	const cartTableBody = document.querySelector("#cart-table-body");

	if (!cartTableBody) {
		return;
	}
	cartTableBody.innerHTML = "";
	itemCartList.forEach((detail, index) => {


		const row = document.createElement("tr");
		const lineTotal = Number(detail.price) * Number(detail.qty);
		row.innerHTML = `
				<td>${detail.itemId}</td>
				<td>${detail.name}</td>
				<td>${detail.price}</td>
				<td>${detail.qty}</td>
				<td>${lineTotal.toFixed(2)}</td>
				<td><button class="buttons order-buttons btn-delete cart-item-delete-btn" data-index="${index}">-</button></td>	
			`;
		cartTableBody.appendChild(row);

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
	const customer = customerDataList.customers.find(c => c.id === selectedCustomer);
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
	const item = itemDataList.items.find(i => i.id === selectedItemId);
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
export function resetOrderForm() {
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

	customerDataList = customerModelInstance.getAllCustomers();
	itemDataList = itemModelInstance.getAllItems();
	itemCartList.length = 0;
	loadOrderPage();
	loadCartTable();
	setupDateAndOrderId();
	hideDiscountFieldError();
	hidePaidFieldError();
	hideOrderUpdateButton();
	resetDashboard();
}

export function addItemToCart() {
	const itemId = document.getElementById("order-item-code").value.trim();
	const qty = Number(document.getElementById("order-item-qty").value);
	const onHandQty = document.getElementById("order-item-qty-on-hand");
	const itemName = document.getElementById("order-item-name").value;
	const itemPrice = document.getElementById("order-item-price").value;

	const isValid = isOrderFormValid();
	if (!isValid.isValid) {
		alert(isValid.message);
		return;
	}

	const existingCartItem = itemCartList.find(i => i.itemId === itemId);
	const total = Number(itemPrice) * qty;

	onHandQty.value -= qty;

	if (existingCartItem) {
		existingCartItem.qty += qty;
		existingCartItem.total = Number(existingCartItem.price) * Number(existingCartItem.qty);


	} else {
		itemCartList.push(new CartItem(itemId, itemName, Number(itemPrice), total, qty));
	}
	loadCartTable();
	calculateOrderTotals();
}


document.addEventListener("click", (event) => {
	if (event.target.classList.contains("cart-item-delete-btn")) {
		const index = event.target.getAttribute("data-index");
		removeItemFromCart(index);
	}
});


function removeItemFromCart(index) {
	const cartItem = itemCartList[index];
	const onHandQtyInput = document.getElementById("order-item-qty-on-hand");
	if (cartItem && onHandQtyInput) {
		if(cartItem.qty > 1) {
			cartItem.qty -= 1;
			cartItem.total = Number(cartItem.price) * Number(cartItem.qty);
		} else {
			itemCartList.splice(index, 1);
		}
		onHandQtyInput.value = Number(onHandQtyInput.value) + 1;
		loadCartTable();
		calculateOrderTotals();
	}
}


function isOrderFormValid() {
	const itemId = document.getElementById("order-item-code").value.trim();
	const qty = Number(document.getElementById("order-item-qty").value);
	const onHandQty = document.getElementById("order-item-qty-on-hand");



	if (itemId === "" || Number.isNaN(qty) || qty <= 0) {
		return { isValid: false, message: "Please select an item and enter a valid quantity." };
	}
	const item = itemDataList.items.find(i => i.id === itemId);
	if (!item) {
		return { isValid: false, message: "Selected item not found." };
	}
	if (qty > onHandQty.value) {
		return { isValid: false, message: "Requested quantity exceeds available stock." };
	}
	return { isValid: true };
}




export function calculateOrderTotals() {
	const totalLabel = document.getElementById("order-total-display");
	const subtotalLabel = document.getElementById("order-subtotal-display");
	const discountPreField = document.getElementById("discount-input");
	const paidField = document.getElementById("cash-input");
	const balanceField = document.getElementById("balance-display");
	const paidAmountLabel = document.getElementById("order-paid-amount");
	const paidAmountDisplay = document.getElementById("order-paid-display");

	let paidAmount = 0;
	if (paidAmountLabel && paidAmountDisplay && !paidAmountLabel.classList.contains("hidden")) {
		const parsedPaidAmount = Number(paidAmountDisplay.textContent);
		paidAmount = Number.isFinite(parsedPaidAmount) ? parsedPaidAmount : 0;
	}


	const total = itemCartList.reduce((sum, cartItem) => {
		const item = itemDataList.items.find(i => i.id === cartItem.itemId);
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
	subtotalDisplay = `${(total - discount - paidAmount).toFixed(2)}`;
	balance = `${(Number(subtotalDisplay) - Number(paid)).toFixed(2)}`;

	totalLabel.textContent = totalDisplay;
	subtotalLabel.textContent = subtotalDisplay;
	balanceField.value = balance;
	setupChangeAndDue(); // Recalculate change/due based on updated totals and paid amount
}

const cashInputField = document.getElementById("cash-input");
if (cashInputField) {
	cashInputField.addEventListener("input", calculateOrderTotals);
}

const discountInputField = document.getElementById("discount-input");
if (discountInputField) {
	discountInputField.addEventListener("input", calculateOrderTotals);
}



export function placeOrder() {

	const newOrderId = orderModelInstance.generateNewOrderId();
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

	const details = itemCartList.map(cartItem => new OrderDetails(
		newOrderId,
		cartItem.itemId,
		cartItem.qty
	));

	const newOrder = new Order(
		newOrderId, customerId === "" ? null : customerId,
		orderDate, totalDisplay,
		discountPreField.value.trim() === "" ? "0" : discountPreField.value,
		paid,
		details);

	orderModelInstance.placeOrder(newOrder);

	alert("Order placed successfully!");
	loadItems();
	loadItemTable();
	resetDashboard();
	resetOrderForm();
	resetOrderHistory();
}

export function updateOrder() {
	const orderId = document.getElementById("order-id-display").value.trim();
	const customerIdFieldValue = document.getElementById("order-cust-id").value.trim();
	const orderDate = document.getElementById("order-date").value;
	const discountPreField = document.getElementById("discount-input");
	const paidField = document.getElementById("cash-input");
	let partialPaidAmount = document.getElementById("order-paid-display").textContent.trim();



	if (orderId === "") {
		alert("Please select an order to update.");
		return;
	}

	const existingOrder = ordersList.find(order => order.id === orderId);
	partialPaidAmount = existingOrder ? Number(existingOrder.paid) : 0;
	
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
	

	const updatedDetails = itemCartList.map((cartItem) => new OrderDetails(
		orderId,
		cartItem.itemId,
		cartItem.qty
	));

	const updatedOrder = new Order(
		orderId, 
		customerIdFieldValue === "" ? null : customerIdFieldValue,
		orderDate, 
		totalDisplay,
		discountPreField.value.trim() === "" ? "0" : discountPreField.value,
		Number(paidField.value) + Number(partialPaidAmount),
		updatedDetails
	);

	orderModelInstance.updateOrder(updatedOrder);

	resetDashboard();
	resetOrderForm();
	resetOrderHistory();
	resetItemPage();
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
	} else if (paidField.value < subtotalAmount ) {
		balanceField.value = (subtotalAmount - Number(paidField.value)).toFixed(2);
		if (balanceLabel) {
			balanceLabel.textContent = "Due:";
			balanceLabel.style.color = "red";
		}

	} else {
		const paidcashAmount = Number(paidField.value);
		const changeDue = paidcashAmount - subtotalAmount;
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

document.addEventListener("click", (event) => {
	if (event.target.tagName === "TD" && event.target.parentElement.parentElement.id === "history-table-body") {
		const cells = event.target.parentElement.children;
		const orderId = cells[0].textContent.trim();
		const order = ordersList.find(o => o.id === orderId);
		if (order) {
			document.getElementById("order-id-display").value = order.id;
			document.getElementById("order-date").value = order.date;

			const customer = customerDB.find(c => c.id === order.customerId);
			document.getElementById("order-cust-id").value = customer ? customer.id : "----";
			document.getElementById("order-cust-name").value = customer ? customer.name : "Walk-in Customer";
			document.getElementById("order-cust-phone").value = customer ? customer.phone : "----";
			document.getElementById("order-cust-address").value = customer ? customer.address : "----";
			document.getElementById("discount-input").value = order.discount;
			document.getElementById("cash-input").value = `${(0).toFixed(2)}`;
			const orderPaidAmount = document.getElementById("order-paid-display");
			if (orderPaidAmount) {
				orderPaidAmount.textContent = `${(order.paid).toFixed(2)}`;
			}

			itemCartList.length = 0;
			order.orderDetails.forEach(detail => {
				const item = itemDataList.items.find(i => i.id === detail.itemId);
				const itemName = item ? item.name : "Unknown Item";
				const itemPrice = item ? item.price : 0;
				const total = itemPrice * detail.qty;
				itemCartList.push(new CartItem(detail.itemId, itemName, itemPrice, total, detail.qty));
			});
			loadCartTable();
			showOrderUpdateButton();
			calculateOrderTotals();
			navigateToOrderFromHistory();
		}
	}
});