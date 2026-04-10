import { itemDB, ordersList, ordersDetailsList } from "../db/data.js";

export class OrderModel {

    getAllOrders() {
        if (ordersList.length === 0) {
            return { isEmpty: true, orders: [] };
        } else {
            return { isEmpty: false, orders: ordersList };
        }
    }


    placeOrder(newOrder) {

        const details = newOrder.orderDetails;


        details.map(detail => {
            const item = itemDB.find(i => i.id === detail.itemId);
            if (item) {
                item.qty -= detail.qty;
            }
        });

        ordersDetailsList.push(...details);
        ordersList.push(newOrder);

        alert("Order placed successfully!");
    }

    formatOrderId(id) {
        return `ORD-${String(id).padStart(3, "0")}`;
    }

    generateNewOrderId() {
        const maxId = ordersList.reduce((max, order) => {
            const numPart = parseInt(order.id.split("-")[1], 10);
            return Math.max(max, numPart);
        }, 0);
        return this.formatOrderId(maxId + 1);
    }

    updateOrder(updatedOrder) {

        if (!updatedOrder || !updatedOrder.id) {
            alert("Invalid order data. Update failed.");
            return;
        }
        const orderId = updatedOrder.id;
        const existingOrderIndex = ordersList.findIndex(order => order.id === orderId);

        if (existingOrderIndex === -1) {
            alert("Order not found. Update failed.");
            return;
        }


        const existingOrder = ordersList[existingOrderIndex];
        const previousDetails = Array.isArray(existingOrder.orderDetails) ? existingOrder.orderDetails : [];



        // Restore previous stock before checking and applying the updated cart quantities.
        previousDetails.forEach(detail => {
            const item = itemDB.find(i => i.id === detail.itemId);
            if (item) {
                item.qty += detail.qty;
            }
        });


        ordersList[existingOrderIndex] = updatedOrder;

        const updatedDetails = updatedOrder.orderDetails;

        updatedDetails.forEach(detail => {
            const item = itemDB.find(i => i.id === detail.itemId);
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

        alert("Order updated successfully!");
    }
}