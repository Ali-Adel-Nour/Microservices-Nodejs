export class CartItem {
    constructor(
        public productId: number,
        public qty: number,
        public price: number,
        public itemName: string,
        public id?: number,
    ) {}
}

export class Cart {
    constructor(
        public userId: number,
        public items: CartItem[],
        public id?: number,
    ) {}
}
