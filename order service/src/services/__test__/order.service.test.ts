import { faker } from "@faker-js/faker";
import { OrderService } from "../order.service";
import { getMockOrderRepository } from "../../repository/mockOrder.repository";
import { OrderRepositoryType } from "../../types/repository.types";
import { OrderStatus } from "../../models/order.model";

const mockOrder = () => ({
    userId: faker.number.int({ min: 1, max: 1000 }),
    status: OrderStatus.PENDING,
    txnId: faker.string.uuid(),
    items: [
        {
            productId: faker.number.int({ min: 1, max: 1000 }),
            qty: faker.number.int({ min: 1, max: 10 }),
            price: +faker.commerce.price(),
            itemName: faker.commerce.productName(),
        },
    ],
});

describe("OrderService", () => {
    let repository: OrderRepositoryType;

    beforeEach(() => {
        repository = getMockOrderRepository();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("createOrder", () => {
        test("should create an order", async () => {
            const service = new OrderService(repository);
            const result = await service.createOrder(mockOrder() as any);
            expect(result).toMatchObject({
                id: expect.any(Number),
                userId: expect.any(Number),
                status: OrderStatus.PENDING,
                items: expect.any(Array),
            });
        });

        test("should throw an error if order creation fails", async () => {
            const service = new OrderService(repository);
            jest.spyOn(repository, "create").mockRejectedValue(new Error("Failed to create order"));
            await expect(service.createOrder(mockOrder() as any)).rejects.toThrow("Failed to create order");
        });
    });

    describe("updateOrder", () => {
        test("should update an order", async () => {
            const service = new OrderService(repository);
            const created = await service.createOrder(mockOrder() as any);
            const updated = { ...created, status: OrderStatus.CONFIRMED };
            const result = await service.updateOrder(updated as any);
            expect(result).toMatchObject({ id: created.id, status: OrderStatus.CONFIRMED });
        });

        test("should throw an error if order not found", async () => {
            const service = new OrderService(repository);
            jest.spyOn(repository, "update").mockRejectedValue(new Error("Order not found"));
            await expect(service.updateOrder(mockOrder() as any)).rejects.toThrow("Order not found");
        });
    });

    describe("getOrders", () => {
        test("should return orders for a user", async () => {
            const service = new OrderService(repository);
            const input = mockOrder();
            await service.createOrder(input as any);
            const result = await service.getOrders(input.userId);
            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({ userId: input.userId });
        });

        test("should return empty array if no orders found", async () => {
            const service = new OrderService(repository);
            const result = await service.getOrders(999);
            expect(result).toHaveLength(0);
        });
    });

    describe("getOrder", () => {
        test("should return an order by id", async () => {
            const service = new OrderService(repository);
            const created = await service.createOrder(mockOrder() as any);
            const result = await service.getOrder(created.id!);
            expect(result).toMatchObject({ id: created.id });
        });

        test("should throw an error if order not found", async () => {
            const service = new OrderService(repository);
            jest.spyOn(repository, "findOne").mockRejectedValue(new Error("Order not found"));
            await expect(service.getOrder(999)).rejects.toThrow("Order not found");
        });
    });

    describe("deleteOrder", () => {
        test("should delete an order", async () => {
            const service = new OrderService(repository);
            const created = await service.createOrder(mockOrder() as any);
            const result = await service.deleteOrder(created.id!);
            expect(result).toEqual({});
        });

        test("should throw an error if order not found", async () => {
            const service = new OrderService(repository);
            jest.spyOn(repository, "delete").mockRejectedValue(new Error("Order not found"));
            await expect(service.deleteOrder(999)).rejects.toThrow("Order not found");
        });
    });
});
