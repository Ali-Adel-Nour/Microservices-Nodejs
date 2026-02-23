import {ICatalogRepository} from "../interface/catalogRepository.interface";
import {Product} from "../models/product.model";

export class CatalogService{
    
    constructor(private _repository:ICatalogRepository){
    }
    createProduct(input:Product){

    }

    updateProduct(input:Product){

    }
    getProducts(limit:number,offset:number){

    }
     getProduct(id:number){

    }
    deleteProduct(id:number){

    }
}