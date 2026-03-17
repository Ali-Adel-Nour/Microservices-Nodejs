export enum OrderStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    DELIVERED = "delivered",
    CANCELLED = "cancelled",
}

export class OrderItem {
    constructor(
        public productId: number,
        public qty: number,
        public price: number,
        public itemName: string,
        public id?: number,
    ) {}
}

export class Order {
    constructor(
        public userId: number,
        public status: OrderStatus,
        public items: OrderItem[],
        public txnId?: string,
        public id?: number,
    ) {}
}
