import request from 'supertest';
import express from 'express';
import { faker } from '@faker-js/faker';
import catalogRoutes, { service } from '../catalog.routes';

const app = express();
app.use(express.json());
app.use(catalogRoutes);

const mockProduct = () => {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: +faker.commerce.price(),
    stock: faker.number.int({ min: 10, max: 100 }),
  };
};

describe('catalog.routes', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /products', () => {
    it('should create a new product', async () => {
      const product = mockProduct();
      jest.spyOn(service, 'createProduct').mockResolvedValue(product);

      const response = await request(app)
        .post('/products')
        .send(product)
        .set('Accept', 'application/json');
      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    it('should throw an error if product creation fails', async () => {
      jest
        .spyOn(service, 'createProduct')
        .mockRejectedValue(new Error('Failed to create product'));

      const response = await request(app)
        .post('/products')
        .send(mockProduct())
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
    });
  });

  describe('PUT /products/:id', () => {
    it('should update a product', async () => {
      const product = mockProduct();
      jest.spyOn(service, 'updateProduct').mockResolvedValue(product);

      const response = await request(app)
        .put(`/products/${product.id}`)
        .send(product)
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    it("should throw an error if product doesn't exist", async () => {
      jest
        .spyOn(service, 'updateProduct')
        .mockRejectedValue(new Error("Product doesn't exist"));

      const response = await request(app)
        .put(`/products/999`)
        .send(mockProduct())
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
    });
  });

  describe('GET /products', () => {
    it('should return a list of products', async () => {
      const products = [mockProduct(), mockProduct()];
      jest.spyOn(service, 'getProducts').mockResolvedValue(products);

      const response = await request(app)
        .get('/products')
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    it('should throw an error if fetching products fails', async () => {
      jest
        .spyOn(service, 'getProducts')
        .mockRejectedValue(new Error('Failed to fetch products'));

      const response = await request(app)
        .get('/products')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product by id', async () => {
      const product = mockProduct();
      jest.spyOn(service, 'getProduct').mockResolvedValue(product);

      const response = await request(app)
        .get(`/products/${product.id}`)
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        price: expect.any(Number),
        stock: expect.any(Number),
      });
    });

    it('should throw an error if product is not found', async () => {
      jest
        .spyOn(service, 'getProduct')
        .mockRejectedValue(new Error('Product not found'));

      const response = await request(app)
        .get('/products/999')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      jest.spyOn(service, 'deleteProduct').mockResolvedValue({});

      const response = await request(app)
        .delete(`/products/1`)
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
    });

    it('should throw an error if product is not found', async () => {
      jest
        .spyOn(service, 'deleteProduct')
        .mockRejectedValue(new Error('Product not found'));

      const response = await request(app)
        .delete('/products/999')
        .set('Accept', 'application/json');
      expect(response.status).toBe(500);
    });
  });
});

