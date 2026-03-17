import { CartRepositoryType } from "../types/repository.types";
import { Cart } from "../models/cart.model";

export const getMockCartRepository = (): CartRepositoryType => {
    let carts: Cart[] = [];
    let nextId = 1;

    return {
        async create(data: any): Promise<{}> {
            const cart = new Cart(data.userId, data.items, nextId++);
            carts.push(cart);
            return cart;
        },

        async update(data: any): Promise<{}> {
            const index = carts.findIndex((c) => c.id === data.id);
            if (index === -1) throw new Error("Cart not found");
            carts[index] = data;
            return data;
        },

        async delete(id: number): Promise<{}> {
            const index = carts.findIndex((c) => c.id === id);
            if (index === -1) throw new Error("Cart not found");
            carts.splice(index, 1);
            return {};
        },

        async find(userId: number): Promise<{}> {
            return carts.find((c) => c.userId === userId) || {};
        },
    };
};

export const MockCartRepository = getMockCartRepository();

