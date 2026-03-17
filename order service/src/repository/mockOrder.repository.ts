import { OrderRepositoryType } from "../types/repository.types";
import { Order } from "../models/order.model";

export const getMockOrderRepository = (): OrderRepositoryType => {
    let orders: Order[] = [];
    let nextId = 1;

    return {
        async create(data: any): Promise<{}> {
            const order = new Order(data.userId, data.status, data.items, data.txnId, nextId++);
            orders.push(order);
            return order;
        },

        async update(data: any): Promise<{}> {
            const index = orders.findIndex((o) => o.id === data.id);
            if (index === -1) throw new Error("Order not found");
            orders[index] = data;
            return data;
        },

        async delete(id: number): Promise<{}> {
            const index = orders.findIndex((o) => o.id === id);
            if (index === -1) throw new Error("Order not found");
            orders.splice(index, 1);
            return {};
        },

        async find(userId: number): Promise<{}> {
            return orders.filter((o) => o.userId === userId);
        },

        async findOne(id: number): Promise<{}> {
            const order = orders.find((o) => o.id === id);
            if (!order) throw new Error("Order not found");
            return order;
        },
    };
};

export const MockOrderRepository = getMockOrderRepository();

