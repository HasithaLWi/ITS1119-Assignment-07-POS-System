import { itemDB, ordersDetailsList } from "../db/data.js";

export class ItemModel {


    getAllItems() {
        if (itemDB.length === 0) {
            return { isEmpty: true, items: [] };
        } else {
            return { isEmpty: false, items: [...itemDB] };
        }
    }

    saveItem(item) {
        let isDuplicate = false;
        itemDB.forEach(existingItem => {
            if (existingItem.name === item.name) {
                alert("Item with this name already exists.");
                isDuplicate = true;
                return;
            }
        });
        if (isDuplicate) {
            return;
        }
        itemDB.push(item);
        alert("Item added successfully.");
    }

    updateItem(updatedItem) {
        const index = itemDB.findIndex(item => item.id === updatedItem.id);
        if (index >= 0 && index < itemDB.length) {
            itemDB[index] = { ...itemDB[index], ...updatedItem };
            alert("Item updated successfully.");
        } else {
            alert("Item not found.");
        }
    }

    deleteItem(id) {
        const index = itemDB.findIndex(item => item.id === id);
        const orderDetails = ordersDetailsList.find(od => od.itemId === id);
        if (index >= 0 && index < itemDB.length) {
            if (orderDetails) {
                alert("Cannot delete item. It is associated with an existing order.");
                return;
            }
            itemDB.splice(index, 1);
            alert("Item deleted successfully.");
        } else {
            alert("Item not found.");
        }
    }

    generateNewItemCode() {
        const maxId = itemDB.reduce((max, item) => {
            const numPart = parseInt(item.id.split("-")[1], 10);
            return Math.max(max, numPart);
        }, 0);
        return this.formatItemCode(maxId + 1);
    }

    formatItemCode(id) {
        return `ITM-${String(id).padStart(3, "0")}`;
    }
}