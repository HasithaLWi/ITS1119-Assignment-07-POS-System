const THEME_KEY = "pos-theme";
const ACCENT_KEY = "pos-accent";


import { saveCustomer, updateCustomer, resetCustomerpage } from "./controller/customerController.js";
import { saveItem, updateItem, resetItemPage } from "./controller/itemController.js";
import { addItemToCart, placeOrder, updateOrder, resetOrderForm } from "./controller/orderController.js";
import { resetOrderHistory } from "./controller/orderHistoryController.js";
import { resetDashboard } from "./controller/dashboardController.js";

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
}

export function initAccentPicker() {
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

export function applyTheme(theme, button) {
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
	resetDashboard();
});


// // --- Authentication Logic ---

// let username = "admin";
// let password = "admin123";

// const loginBtn = document.getElementById("login-btn");
// loginBtn.addEventListener("click", (event) => {
// 	event.preventDefault();
// 	const username = document.getElementById("username").value.trim();
// 	const password = document.getElementById("password").value.trim();

// 	if (username === "") {
// 		alert("Please enter a username.");
// 		return;
// 	} else if (username !== "admin") {
// 		alert("Invalid username. Please try again.");
// 		return;
// 	}

// 	if (password === "") {
// 		alert("Please enter a password.");
// 		return;
// 	} else if (password !== "admin123") {
// 		alert("Invalid password. Please try again.");
// 		return;
// 	}

// 	document.getElementById("welcome-message").textContent = `Welcome, ${username}!`;
// 	document.getElementById("login").classList.add("hidden");
// 	document.getElementById("main-app").classList.remove("hidden");

// 	resetCustomerpage();
// 	resetItemPage();
// 	resetOrderForm();
// 	resetOrderHistory();

// });

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




