

class customerModel {

    // Fetch Customers from Local Storage
    getAllCustomers() {

        if (customerDB.length === 0) {

            return { isEmpty: true, customers: [] };
        } else {
            return { isEmpty: false, customers: customerDB };
        }
    }

    saveCustomer(newCustomer) {
        customerDB.push(newCustomer);
    }

    // Update Customer
    updateCustomer(customer) {
        const index = customerDB.findIndex(c => c.id === customer.id);
        if (index >= 0 && index < customerDB.length) {
            customerDB[index] = { ...customerDB[index], ...customer };
        } else {
            alert("Invalid Customer ID.");
        }
    }

    // Delete Customer
    deleteCustomer(customerId) {
        const index = customerDB.findIndex(c => c.id === customerId);
        const orderIndex = ordersList.findIndex(o => o.customerId === customerId);
        if (index >= 0 && index < customerDB.length) {
            if (orderIndex >= 0) {
                alert("Cannot delete customer with existing orders.");
                
                return;
             }

            customerDB.splice(index, 1);
            alert("Customer deleted successfully.");
        } else {
            alert("Invalid Customer ID.");
        }
    }
}