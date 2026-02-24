import {ICatalogRepository} from "../interface/catalogRepository.interface";
import {Product} from "../models/product.model";

export class CatalogService{
    
    constructor(private _repository:ICatalogRepository){
    }
   async createProduct(input:Product){
      const data = await this._repository.create(input);
      if(!data) throw new Error("Failed to create product");
      return data;
    }

    async updateProduct(input:Product){
        const data = await this._repository.update(input);
        if(!data) throw new Error("Failed to update product");
        return data;

    }
    async getProducts(limit:number,offset:number):Promise<Product[]>{
        return this._repository.find(limit,offset);
    }
     async getProduct(id:number){
        const data = await this._repository.findOne(id);
        if(!data) throw new Error("Product not found");
        return data;
    }
     async deleteProduct(id:number){
        const data = await this._repository.delete(id);
        return data;
    }
}