

/* ----------------------------------------------------------------------------------------------
								   Order History Management Logic
   ----------------------------------------------------------------------------------------------*/
const historyFilteredOrders = [];
if(historyFilteredOrders.length === 0){
	historyFilteredOrders.push(...ordersList);
}

function loadOrderHistory(orders = ordersList) {
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
		const customer = customerDB.find(c => c.id === order.customerId);
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

function resetOrderHistory() {
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
	historyFilteredOrders.push(...ordersList);
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
		const customer = customerDB.find(c => c.id === order.customerId);
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

		const filtered = ordersList.filter((order) => {
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

			itemCartList.length = 0;
			order.orderDetails.forEach(detail => {
				itemCartList.push({ itemId: detail.itemId, qty: detail.qty });
			});
			loadCartTable();
			calculateOrderTotals();
			showOrderUpdateButton();
			navigateToOrderFromHistory();
		}
	}
});

// navidate to order
function navigateToOrderFromHistory() {
	const orderId = document.getElementById("order-id-display").value.trim();
	if (orderId === "") {
		alert("Please select an order from the history table first.");
		return;
	}
	const order = ordersList.find(o => o.id === orderId);
	if (!order) {
		alert("Selected order not found.");
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

function showOrderUpdateButton() {
	const orderUpdateButtons = document.getElementById("order-update-btns");
	const orderSubmitButtons = document.querySelector(".summary-btns");
	const orderDueDisplay = document.getElementById("order-paid-amount");

	if (orderUpdateButtons && orderSubmitButtons) {
		orderUpdateButtons.classList.remove("hidden");
		orderDueDisplay.classList.remove("hidden");
		orderSubmitButtons.classList.add("hidden");
	}
}

function hideOrderUpdateButton() {
	const orderUpdateButtons = document.getElementById("order-update-btns");
	const orderSubmitButtons = document.querySelector(".summary-btns");
	const orderDueDisplay = document.getElementById("order-paid-amount");
	if (orderUpdateButtons && orderSubmitButtons) {
		orderUpdateButtons.classList.add("hidden");
		orderDueDisplay.classList.add("hidden");
		orderSubmitButtons.classList.remove("hidden");
	}
}
