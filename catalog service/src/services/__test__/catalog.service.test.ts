import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { CatalogService } from "../catalog.service";
import { faker } from "@faker-js/faker";
import { ProductFactory } from "../../utils/features";


const mockProduct = () => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price(),
    stock: faker.number.int({ min: 10, max: 100 }),
  };
};

describe("catalogService", () => {
  let repository: ICatalogRepository;

  beforeEach(() => {
    repository = new MockCatalogRepository();
  });

  afterEach(() => {
    repository = {} as MockCatalogRepository;
  });

  describe("createProduct", () => {
    test("should create a product", async () => {
      const service = new CatalogService(repository);

      const reqBody = mockProduct();

      const result = await service.createProduct(reqBody);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("should throw an error if product creation fails", async () => {
      const service = new CatalogService(repository);

      const reqBody = mockProduct();
      jest
        .spyOn(repository, "create")
        .mockRejectedValue(new Error("Failed to create product"));
      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "Failed to create product",
      );
    });

    test("should throw an error with product already exist", async () => {
      const service = new CatalogService(repository);

      const reqBody = mockProduct();
      jest
        .spyOn(repository, "create")
        .mockRejectedValue(new Error("Product already exists"));
      await expect(service.createProduct(reqBody)).rejects.toThrow(
        "Product already exists",
      );
    });
  });

  describe("updateProduct", () => {
    test("should update a product", async () => {
      const service = new CatalogService(repository);

      const reqBody = mockProduct();
      const createdProduct = await service.createProduct(reqBody);
      const updatedData = { ...createdProduct, name: "Updated Product Name" };
      const result = await service.updateProduct(updatedData);
      expect(result).toMatchObject({
        id: createdProduct.id,
        name: "Updated Product Name",
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("should throw an error with product doesn't exist", async () => {
      const service = new CatalogService(repository);

      const reqBody = mockProduct();
      jest
        .spyOn(repository, "update")
        .mockRejectedValue(new Error("Product doesn't exist"));
      await expect(service.updateProduct(reqBody)).rejects.toThrow(
        "Product doesn't exist",
      );
    });
  });

  describe("getProducts", () => {
    test("should return a list of products", async () => {
      const service = new CatalogService(repository);
      const randomLimit = faker.number.int({ min: 1, max: 10 });
      const products = ProductFactory.buildList(randomLimit);
      for (const product of products) {
        await repository.create(product);
      }
      const result = await service.getProducts(randomLimit, 0);
      expect(result).toHaveLength(randomLimit);
      expect(result[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("should return an empty list if no products exist", async () => {
      const service = new CatalogService(repository);
      const result = await service.getProducts(10, 0);
      expect(result).toHaveLength(0);
    });
  });

  describe("getProduct", () => {
    test("should return a product by id", async () => {
      const service = new CatalogService(repository);

      const reqBody = mockProduct();
      const createdProduct = await service.createProduct(reqBody);
      const result = await service.getProduct(createdProduct.id!);
      expect(result).toMatchObject({
        id: createdProduct.id,
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("should throw an error if product is not found", async () => {
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "findOne")
        .mockRejectedValue(new Error("Product not found"));
      await expect(service.getProduct(999)).rejects.toThrow(
        "Product not found",
      );
    });
  });

  describe("deleteProduct", () => {
    test("should delete a product by id", async () => {
      const service = new CatalogService(repository);

      const reqBody = mockProduct();
      const createdProduct = await service.createProduct(reqBody);
      const result = await service.deleteProduct(createdProduct.id!);
      expect(result).toMatchObject({});
    });

    test("should throw an error if product to delete is not found", async () => {
      const service = new CatalogService(repository);

      jest
        .spyOn(repository, "delete")
        .mockRejectedValue(new Error("Product not found"));
      await expect(service.deleteProduct(999)).rejects.toThrow(
        "Product not found",
      );
    });
  });
});

