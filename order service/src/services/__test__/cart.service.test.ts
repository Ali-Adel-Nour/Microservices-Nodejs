import { faker } from "@faker-js/faker";
import { CartService } from "../cart.service";
import { getMockCartRepository } from "../../repository/mockCart.repository";
import { CartRepositoryType } from "../../types/repository.types";

const mockCart = () => ({
    userId: faker.number.int({ min: 1, max: 1000 }),
    items: [
        {
            productId: faker.number.int({ min: 1, max: 1000 }),
            qty: faker.number.int({ min: 1, max: 10 }),
            price: +faker.commerce.price(),
            itemName: faker.commerce.productName(),
        },
    ],
});

describe("CartService", () => {
    let repository: CartRepositoryType;

    beforeEach(() => {
        repository = getMockCartRepository();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("createCart", () => {
        test("should create a cart", async () => {
            const service = new CartService(repository);
            const result = await service.createCart(mockCart());
            expect(result).toMatchObject({
                id: expect.any(Number),
                userId: expect.any(Number),
                items: expect.any(Array),
            });
        });

        test("should throw an error if cart creation fails", async () => {
            const service = new CartService(repository);
            jest.spyOn(repository, "create").mockRejectedValue(new Error("Failed to create cart"));
            await expect(service.createCart(mockCart())).rejects.toThrow("Failed to create cart");
        });
    });

    describe("updateCart", () => {
        test("should update a cart", async () => {
            const service = new CartService(repository);
            const created = await service.createCart(mockCart());
            const updated = { ...created, items: [] };
            const result = await service.updateCart(updated);
            expect(result).toMatchObject({ id: created.id, items: [] });
        });

        test("should throw an error if cart not found", async () => {
            const service = new CartService(repository);
            jest.spyOn(repository, "update").mockRejectedValue(new Error("Cart not found"));
            await expect(service.updateCart({ id: 999, userId: 1, items: [] })).rejects.toThrow("Cart not found");
        });
    });

    describe("getCart", () => {
        test("should return a cart by userId", async () => {
            const service = new CartService(repository);
            const input = mockCart();
            await service.createCart(input);
            const result = await service.getCart(input.userId);
            expect(result).toMatchObject({ userId: input.userId });
        });

        test("should return empty object if cart not found", async () => {
            const service = new CartService(repository);
            const result = await service.getCart(999);
            expect(result).toEqual({});
        });
    });

    describe("deleteCart", () => {
        test("should delete a cart", async () => {
            const service = new CartService(repository);
            const created = await service.createCart(mockCart());
            const result = await service.deleteCart(created.id);
            expect(result).toEqual({});
        });

        test("should throw an error if cart not found", async () => {
            const service = new CartService(repository);
            jest.spyOn(repository, "delete").mockRejectedValue(new Error("Cart not found"));
            await expect(service.deleteCart(999)).rejects.toThrow("Cart not found");
        });
    });
});
