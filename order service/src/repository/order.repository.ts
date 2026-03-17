import { PrismaClient } from "../generated/prisma/client";
import { Order, OrderItem } from "../models/order.model";
import { OrderRepositoryType } from "../types/repository.types";

const prisma = new PrismaClient();

export const OrderRepository: OrderRepositoryType = {
    async create(data: any): Promise<{}> {
        const order = await prisma.order.create({
            data: {
                userId: data.userId,
                status: data.status,
                txnId: data.txnId,
                items: {
                    create: data.items.map((item: OrderItem) => ({
                        productId: item.productId,
                        qty: item.qty,
                        price: item.price,
                        itemName: item.itemName,
                    })),
                },
            },
            include: { items: true },
        });

        return new Order(
            order.userId,
            order.status as any,
            order.items.map((i: { productId: number; qty: number; price: number; itemName: string; id: number; }) =>
                new OrderItem(i.productId, i.qty, i.price, i.itemName, i.id)
            ),
            order.txnId ?? undefined,
            order.id,
        );
    },

    async update(data: any): Promise<{}> {
        await prisma.orderItem.deleteMany({ where: { orderId: data.id } });

        const order = await prisma.order.update({
            where: { id: data.id },
            data: {
                status: data.status,
                txnId: data.txnId,
                items: {
                    create: data.items.map((item: OrderItem) => ({
                        productId: item.productId,
                        qty: item.qty,
                        price: item.price,
                        itemName: item.itemName,
                    })),
                },
            },
            include: { items: true },
        });

        return new Order(
            order.userId,
            order.status as any,
            order.items.map((i: { productId: number; qty: number; price: number; itemName: string; id: number; }) =>
                new OrderItem(i.productId, i.qty, i.price, i.itemName, i.id)
            ),
            order.txnId ?? undefined,
            order.id,
        );
    },

    async delete(id: number): Promise<{}> {
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        await prisma.order.delete({ where: { id } });
        return {};
    },

    async find(userId: number): Promise<{}> {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: true },
        });

        return orders.map(
            (o: { userId: number; status: string; items: Array<{ productId: number; qty: number; price: number; itemName: string; id: number; }>; txnId: string | null; id: number; }) =>
                new Order(
                    o.userId,
                    o.status as any,
                    o.items.map((i: { productId: number; qty: number; price: number; itemName: string; id: number; }) =>
                        new OrderItem(i.productId, i.qty, i.price, i.itemName, i.id)
                    ),
                    o.txnId ?? undefined,
                    o.id,
                )
        );
    },

    async findOne(id: number): Promise<{}> {
        const order = await prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!order) throw new Error("Order not found");

        return new Order(
            order.userId,
            order.status as any,
            order.items.map((i: { productId: number; qty: number; price: number; itemName: string; id: number; }) =>
                new OrderItem(i.productId, i.qty, i.price, i.itemName, i.id)
            ),
            order.txnId ?? undefined,
            order.id,
        );
    },
};
