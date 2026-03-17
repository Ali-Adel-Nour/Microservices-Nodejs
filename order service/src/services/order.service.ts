import { OrderRepositoryType } from "../types/repository.types";
import { Order } from "../models/order.model";
import { GetProductDetails } from "../utils/brokers/api";

export class OrderService {
    constructor(private _repository: OrderRepositoryType) {}

    private async enrichItems(items: Array<{ productId: number; qty: number }>) {
        const enriched = await Promise.all(
            items.map(async (item) => {
                const product = await GetProductDetails(item.productId);
                if (item.qty > product.stock) {
                    throw new Error(`Insufficient stock for product ${item.productId}`);
                }

                return {
                    productId: item.productId,
                    qty: item.qty,
                    price: product.price,
                    itemName: product.name,
                };
            }),
        );

        return enriched;
    }

    async createOrder(input: Order): Promise<Order> {
        const payload = {
            ...input,
            items: await this.enrichItems(input.items as Array<{ productId: number; qty: number }>),
        };
        const data = await this._repository.create(payload) as Order;
        if (!data) throw new Error("Failed to create order");
        return data;
    }

    async updateOrder(input: Order): Promise<Order> {
        const payload = {
            ...input,
            items: await this.enrichItems(input.items as Array<{ productId: number; qty: number }>),
        };
        const data = await this._repository.update(payload) as Order;
        if (!data) throw new Error("Failed to update order");
        return data;
    }

    async getOrders(userId: number): Promise<Order[]> {
        return this._repository.find(userId) as Promise<Order[]>;
    }

    async getOrder(id: number): Promise<Order> {
        const data = await this._repository.findOne!(id) as Order;
        if (!data) throw new Error("Order not found");
        return data;
    }

    async deleteOrder(id: number): Promise<{}> {
        return this._repository.delete(id);
    }
}
