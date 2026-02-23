export interface ICatalogRepository {
    create(data:any):Promise<{}>;
    update(data:any):Promise<{}>;
    delete(id:number):Promise<{}>;
    find():Promise<{}>;
    findOne(id:number):Promise<{}>;
}