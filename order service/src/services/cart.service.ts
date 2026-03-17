import { CartRepositoryType } from "../types/repository.types";
import { GetProductDetails } from "../utils/brokers/api";

export class CartService {
    constructor(private _repository: CartRepositoryType) {}

    private async enrichItems(items: Array<{ productId: number; qty: number }>) {
        const enriched = await Promise.all(
            items.map(async (item) => {
                const product = await GetProductDetails(item.productId);
                if (item.qty > product.stock) {
                    throw new Error(`Insufficient stock for product ${item.productId}`);
                }

                return {
                    productId: item.productId,
                    qty: item.qty,
                    price: product.price,
                    itemName: product.name,
                };
            }),
        );

        return enriched;
    }

    async createCart(input: any): Promise<any> {
        const payload = {
            ...input,
            items: await this.enrichItems(input.items),
        };
        const data = await this._repository.create(payload);
        if (!data) throw new Error("Failed to create cart");
        return data;
    }

    async updateCart(input: any): Promise<any> {
        const payload = {
            ...input,
            items: await this.enrichItems(input.items),
        };
        const data = await this._repository.update(payload);
        if (!data) throw new Error("Failed to update cart");
        return data;
    }

    async getCart(userId: number): Promise<any> {
        return this._repository.find(userId);
    }

    async deleteCart(id: number): Promise<{}> {
        return this._repository.delete(id);
    }
}
