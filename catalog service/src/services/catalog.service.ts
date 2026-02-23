import {ICatalogRepository} from "../interface/catalogRepository.interface";
import {Product} from "../models/product.model";

export class CatalogService{
    
    constructor(private _repository:ICatalogRepository){
    }
   async createProduct(input:Product){
      const data = await this._repository.create(input);
      return data;
    }

    async updateProduct(input:Product){

    }
    async getProducts(limit:number,offset:number){

    }
     async getProduct(id:number){

    }
     async deleteProduct(id:number){

    }
}