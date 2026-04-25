import { navLinks, pages } from "../utils/script.js";
import { OrderModel } from "../model/orderModel.js";
import { customerModel } from "../model/customerModel.js";
import { showAlert } from "../utils/showAlert.js";

const orderModelInstance = new OrderModel();
const customerModelInstance = new customerModel();

let customerDataList = customerModelInstance.getAllCustomers().customers;
let orderHistoryDataList = orderModelInstance.getAllOrders().orders;


const historyFilteredOrders = [];
if (historyFilteredOrders.length === 0) {
	historyFilteredOrders.push(...orderHistoryDataList);
}

function loadOrderHistory(orders = orderHistoryDataList) {
	const historyTableBody = document.querySelector("#history-table-body");
	if (!historyTableBody) {
		return;
	}
	if (orders.length === 0) {
		historyTableBody.innerHTML = "<tr><td colspan='5'>No orders found.</td></tr>";
		return;
	}
	historyTableBody.innerHTML = "";
	orders.forEach((order) => {
		const customer = customerDataList.find(c => c.id === order.customerId);
		const discountAmount = Number(order.discount) ? (Number(order.total) * (Number(order.discount) / 100)) : 0;
		const subtotal = Number(order.total) - discountAmount;
		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${order.id}</td>
			<td>${customer ? customer.name : "Walk-in Customer"}</td>
			<td>${order.date}</td>
			<td>Rs ${Number(order.total).toFixed(2)}</td>
			<td>Rs ${discountAmount.toFixed(2)}</td>
			<td>Rs ${subtotal.toFixed(2)}</td>
			<td>Rs ${Number(order.paid).toFixed(2)}</td>
		`;
		historyTableBody.appendChild(row);
	});
}

export function resetOrderHistory() {
	const searchInput = document.getElementById("history-search");
	const startDateInput = document.getElementById("start-date");
	const endDateInput = document.getElementById("end-date");

	if (startDateInput) {
		startDateInput.value = "";
	}
	if (endDateInput) {
		const today = new Date();
		endDateInput.value = today.toISOString().split("T")[0];
	}
	if (searchInput) {
		searchInput.value = "";
	}
	historyFilteredOrders.length = 0;
	historyFilteredOrders.push(...orderHistoryDataList);


	customerDataList = customerModelInstance.getAllCustomers().customers;
	orderHistoryDataList = orderModelInstance.getAllOrders().orders;
	loadOrderHistory();

}

// Search Orders in History
document.getElementById("history-search").addEventListener("input", function () {
	const query = this.value.toLowerCase().trim();
	const tableBody = document.querySelector("#history-table-body");
	if (!query) {
		loadOrderHistory();
		return;
	}
	const filtered = historyFilteredOrders.filter(order => {
		const customer = customerDataList.find(c => c.id === order.customerId);
		const customerName = customer ? customer.name.toLowerCase() : "walk-in customer";
		return (
			order.id.toLowerCase().includes(query) ||
			customerName.includes(query) ||
			order.date.includes(query)
		);
	});
	if (filtered.length === 0) {
		tableBody.innerHTML = "<tr><td colspan='5'>No orders found.</td></tr>";
	} else {
		tableBody.innerHTML = "";
		loadOrderHistory(filtered);
	}
});

// Filter Orders by Date Range
document.querySelectorAll(".filter-by-date").forEach((input) => {
	const applyDateRangeFilter = () => {
		let startDate = document.getElementById("start-date").value;
		let endDate = document.getElementById("end-date").value;

		if (!startDate && !endDate) {
			loadOrderHistory();
			return;
		}

		const filtered = orderHistoryDataList.filter((order) => {
			const orderDate = String(order.date || "");
			return (!startDate || orderDate >= startDate) && (!endDate || orderDate <= endDate);
		});
		historyFilteredOrders.length = 0;
		historyFilteredOrders.push(...filtered);
		document.getElementById("history-search").value = "";
		loadOrderHistory(filtered);
	};

	input.addEventListener("input", applyDateRangeFilter);
	input.addEventListener("change", applyDateRangeFilter);
});


// navidate to order
export function navigateToOrderFromHistory() {
	const orderId = document.getElementById("order-id-display").value.trim();
	if (orderId === "") {
		showAlert("No Order Selected", "Please select an order from the history table first.", "info");
		return;
	}
	const order = orderHistoryDataList.find(o => o.id === orderId);
	if (!order) {
		showAlert("Order Not Found", "Selected order not found.", "error");
		return;
	}

	navLinks.forEach((link) => {
		const isOrdersLink = link.getAttribute("data-target") === "orders";
		link.classList.toggle("active", isOrdersLink);
	});

	pages.forEach((page) => {
		const isOrdersPage = page.id === "orders";
		page.classList.toggle("active", isOrdersPage);
		page.classList.toggle("hidden", !isOrdersPage);
	});
}

export function showOrderUpdateButton() {
	const orderUpdateButtons = document.getElementById("order-update-btns");
	const orderSubmitButtons = document.querySelector(".summary-btns");
	const orderDueDisplay = document.getElementById("order-paid-amount");
	const orderInvoiceCard = document.getElementById("order-invoice-card");
	const orderItemSelectCard = document.getElementById("order-item-select-card");
	const orderItemTable = document.getElementById("cart-item-table-container");

	if (orderUpdateButtons && orderSubmitButtons) {
		orderUpdateButtons.classList.remove("hidden");
		orderDueDisplay.classList.remove("hidden");
		orderSubmitButtons.classList.add("hidden");
	}

	if (orderInvoiceCard && orderItemSelectCard && orderItemTable) {
		orderInvoiceCard.style.pointerEvents = "none";
		orderItemSelectCard.style.pointerEvents = "none";
		orderItemTable.style.pointerEvents = "none";

		orderInvoiceCard.style.opacity = "0.8";
		orderItemSelectCard.style.opacity = "0.8";
		orderItemTable.style.opacity = "0.8";
	}
}

export function hideOrderUpdateButton() {
	const orderUpdateButtons = document.getElementById("order-update-btns");
	const orderSubmitButtons = document.querySelector(".summary-btns");
	const orderDueDisplay = document.getElementById("order-paid-amount");
	const orderInvoiceCard = document.getElementById("order-invoice-card");
	const orderItemSelectCard = document.getElementById("order-item-select-card");
	const orderItemTable = document.getElementById("cart-item-table-container");

	if (orderUpdateButtons && orderSubmitButtons) {
		orderUpdateButtons.classList.add("hidden");
		orderDueDisplay.classList.add("hidden");
		orderSubmitButtons.classList.remove("hidden");
	}
	if (orderInvoiceCard && orderItemSelectCard && orderItemTable) {
		orderInvoiceCard.style.pointerEvents = "auto";
		orderItemSelectCard.style.pointerEvents = "auto";
		orderItemTable.style.pointerEvents = "auto";

		orderInvoiceCard.style.opacity = "1";
		orderItemSelectCard.style.opacity = "1";
		orderItemTable.style.opacity = "1";
	}
}
