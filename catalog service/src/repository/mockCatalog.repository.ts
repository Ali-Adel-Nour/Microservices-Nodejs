import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";

export class MockCatalogRepository implements ICatalogRepository {
    private products: Product[] = [];
    private nextId = 1;

    async create(data: Product): Promise<Product> {
        const product = new Product(data.name, data.description, data.price, data.stock, this.nextId++);
        this.products.push(product);
        return product;
    }

    async update(data: Product): Promise<Product> {
        const index = this.products.findIndex((p) => p.id === data.id);
        if (index === -1) throw new Error("Product not found");
        this.products[index] = data;
        return data;
    }

    async delete(id: any): Promise<{}> {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) throw new Error("Product not found");
        this.products.splice(index, 1);
        return {};
    }

    async find(limit: number, offset: number): Promise<Product[]> {
        return this.products.slice(offset, offset + limit);
    }

    async findOne(id: number): Promise<Product> {
        const product = this.products.find((p) => p.id === id);
        if (!product) throw new Error("Product not found");
        return product;
    }
}
