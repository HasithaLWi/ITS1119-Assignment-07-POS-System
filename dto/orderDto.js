class OrderDto {
    constructor(id, customerId, date, total, discount, paid) {
        this.id = id;
        this.customerId = customerId;
        this.date = date;
        this.total = total;
        this.discount = discount;
        this.paid = paid;
    }
}