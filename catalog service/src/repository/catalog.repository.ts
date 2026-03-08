import { PrismaClient } from "../generated/prisma/client";
import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";

const prisma = new PrismaClient();

export class CatalogRepository implements ICatalogRepository {
    async create(data: Product): Promise<Product> {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
            },
        });
        return new Product(product.name, product.description, product.price, product.stock, product.id);
    }

    async update(data: Product): Promise<Product> {
        const product = await prisma.product.update({
            where: { id: data.id },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                stock: data.stock,
            },
        });
        return new Product(product.name, product.description, product.price, product.stock, product.id);
    }

    async delete(id: number): Promise<{}> {
        await prisma.product.delete({
            where: { id },
        });
        return {};
    }

    async find(limit: number, offset: number): Promise<Product[]> {
        const products = await prisma.product.findMany({
            take: limit,
            skip: offset,
        });
        return products.map(
            (p) => new Product(p.name, p.description, p.price, p.stock, p.id)
        );
    }

    async findOne(id: number): Promise<Product> {
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) throw new Error("Product not found");
        return new Product(product.name, product.description, product.price, product.stock, product.id);
    }
}