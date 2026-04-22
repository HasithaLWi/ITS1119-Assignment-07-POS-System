const ACCENT_KEY = "pos-accent";


import { saveCustomer, updateCustomer, resetCustomerpage } from "../controller/customerController.js";
import { saveItem, updateItem, resetItemPage } from "../controller/itemController.js";
import { addItemToCart, placeOrder, updateOrder, resetOrderForm } from "../controller/orderController.js";
import { resetOrderHistory } from "../controller/orderHistoryController.js";
// import { resetDashboard } from "./controller/dashboardController.js";

window.saveCustomer = saveCustomer;
window.updateCustomer = updateCustomer;
window.resetCustomerpage = resetCustomerpage;
window.saveItem = saveItem;
window.updateItem = updateItem;
window.resetItemPage = resetItemPage;
window.addItemToCart = addItemToCart;
window.resetOrderForm = resetOrderForm;
window.placeOrder = placeOrder;
window.updateOrder = updateOrder;
window.resetOrderHistory = resetOrderHistory;


function applyAccent(accentColor) {
	document.body.style.setProperty("--accent", accentColor);


	const iframe = document.querySelector("#user-manager-overlay iframe");
	if (iframe && iframe.contentWindow) {
		iframe.contentWindow.postMessage({ type: "SET_ACCENT", color: accentColor }, "*");
	}
}

export function initAccentPicker() {
	const accentPicker = document.getElementById("accent-picker");
	const colorCircle = document.getElementById("color-theme-circle");
	const accentPalette = document.getElementById("accent-palette");
	const swatches = document.querySelectorAll(".accent-swatch");

	// if (!accentPicker || !colorCircle || !accentPalette || swatches.length === 0) {
	// 	return;
	// }
	if (swatches.length === 0) {
		return;
	}

	const defaultAccent = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#f04b66";
	const savedAccent = localStorage.getItem(ACCENT_KEY) || defaultAccent;
	// const savedAccent = defaultAccent;


	applyAccent(savedAccent);
	swatches.forEach((swatch) => {
		swatch.classList.toggle("active", swatch.dataset.color === savedAccent);
	});

	colorCircle.addEventListener("click", (event) => {
		event.stopPropagation();
		accentPalette.classList.toggle("hidden");
		// const isExpanded = !accentPalette.classList.contains("hidden");
		// colorCircle.setAttribute("aria-expanded", String(isExpanded));
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
			// colorCircle.setAttribute("aria-expanded", "false");
		});
	});

	document.addEventListener("click", (event) => {
		if (!accentPicker.contains(event.target)) {
			accentPalette.classList.add("hidden");
			// colorCircle.setAttribute("aria-expanded", "false");
		}
	});
}



document.addEventListener("DOMContentLoaded", () => {
	initAccentPicker();
	// resetDashboard();

	// User Manager Overlay Logic
	const userBtn = document.getElementById("user-btn");
	const userManagerOverlay = document.getElementById("user-manager-overlay");
	if (userBtn && userManagerOverlay) {
		userBtn.addEventListener("click", () => {
			userManagerOverlay.style.display = "flex";

		});
	}

	window.closeUserManager = function () {
		if (userManagerOverlay) {
			userManagerOverlay.style.display = "none";
		}
	};
});

// --- Navigation Logic ---
export const navLinks = document.querySelectorAll('.nav-link');
export const pages = document.querySelectorAll('.content-section');

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




