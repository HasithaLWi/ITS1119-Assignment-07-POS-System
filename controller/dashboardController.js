import { customerModel } from "../model/customerModel.js";
import { ItemModel } from "../model/itemModel.js";
import { OrderModel } from "../model/orderModel.js";

const customerModelInstance = new customerModel();
const itemModelInstance = new ItemModel();
const orderModelInstance = new OrderModel();

let customerDataList = [];
let itemsDataList = [];
let ordersDataList = [];

function loadDashboardData() {
    customerDataList = customerModelInstance.getAllCustomers().customers;
    itemsDataList = itemModelInstance.getAllItems().items;
    ordersDataList = orderModelInstance.getAllOrders().orders;
}

function updateDashboardStats() {
    const statCustomers = document.getElementById('stat-customers-count');
    const statItems = document.getElementById('stat-items-count');
    const statRevenue = document.getElementById('stat-revenue');

    if (statCustomers) {
        statCustomers.textContent = customerDataList.length;
    }
    if (statItems) {
        statItems.textContent = itemsDataList.length;
    }
    if (statRevenue) {
        const totalRevenue = ordersDataList.reduce((sum, order) => {
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

function loadDashboardTable() {
    const recentOrdersBody = document.getElementById('latest-orders-table');
    if (!recentOrdersBody) return;

    const recentOrders = ordersDataList.slice(-5).reverse();
    recentOrdersBody.innerHTML = '';

    recentOrders.forEach(order => {
        const customerName = customerDataList.find(cust => cust.id === order.customerId)?.name || 'Unknown';
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${customerName}</td>
            <td>${order.date}</td>
            <td>${order.total}</td>
        `;
        recentOrdersBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    loadDashboardTable();
    updateDashboardStats();
});

export function resetDashboard() {
    loadDashboardData();
    loadDashboardTable();
    updateDashboardStats();
}