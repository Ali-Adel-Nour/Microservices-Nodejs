type Create = (input: any) => Promise<{}>;
type Update = (input: any) => Promise<{}>;
type Delete = (id: number) => Promise<{}>;
type Find = (userId: number) => Promise<{}>;
type FindOne = (id: number) => Promise<{}>;

export type CartRepositoryType = {
    create: Create;
    update: Update;
    delete: Delete;
    find: Find;
};

export type OrderRepositoryType = {
    create: Create;
    update: Update;
    delete: Delete;
    find: Find;
    findOne: FindOne;
};
