import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { CatalogService } from "../catalog.service";

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

      const reqBody = {
        id: 1,
        name: "Product 1",
        description: "Description of Product 1",
        price: 100,
        stock: 10,
      }

      const result = await service.createProduct({...reqBody
      });
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    test("should throw an error if product creation fails", () => {});
  });

  describe("createProduct", () => {});
});
