import { PrismaClient } from "../generated/prisma/client";
import { CartRepositoryType } from "../types/repository.types";
import { Cart, CartItem } from "../models/cart.model";

const prisma = new PrismaClient();

export const CartRepository: CartRepositoryType = {
    async create(data: any): Promise<{}> {
        const cart = await prisma.cart.create({
            data: {
                userId: data.userId,
                items: {
                    create: data.items.map((item: CartItem) => ({
                        productId: item.productId,
                        qty: item.qty,
                        price: item.price,
                        itemName: item.itemName,
                    })),
                },
            },
            include: { items: true },
        });
        return new Cart(
            cart.userId,
            cart.items.map((i: { productId: number; qty: number; price: number; itemName: string; id: number; }) => new CartItem(i.productId, i.qty, i.price, i.itemName, i.id)),
            cart.id,
        );
    },

    async update(data: any): Promise<{}> {
        await prisma.cartItem.deleteMany({ where: { cartId: data.id } });
        const cart = await prisma.cart.update({
            where: { id: data.id },
            data: {
                items: {
                    create: data.items.map((item: CartItem) => ({
                        productId: item.productId,
                        qty: item.qty,
                        price: item.price,
                        itemName: item.itemName,
                    })),
                },
            },
            include: { items: true },
        });
        return new Cart(
            cart.userId,
            cart.items.map((i: { productId: number; qty: number; price: number; itemName: string; id: number; }) => new CartItem(i.productId, i.qty, i.price, i.itemName, i.id)),
            cart.id,
        );
    },

    async delete(id: number): Promise<{}> {
        await prisma.cartItem.deleteMany({ where: { cartId: id } });
        await prisma.cart.delete({ where: { id } });
        return {};
    },

    async find(userId: number): Promise<{}> {
        const cart = await prisma.cart.findFirst({
            where: { userId },
            include: { items: true },
        });
        if (!cart) return {};
        return new Cart(
            cart.userId,
            cart.items.map((i: { productId: number; qty: number; price: number; itemName: string; id: number; }) => new CartItem(i.productId, i.qty, i.price, i.itemName, i.id)),
            cart.id,
        );
    },
};
