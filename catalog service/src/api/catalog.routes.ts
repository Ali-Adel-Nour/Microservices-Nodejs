import express, { NextFunction, Request, Response } from "express";
import { CatalogService } from "../services/catalog.service";
import { CatalogRepository } from "../repository/catalog.repository";
import { requestValidator } from "../utils/features/requestValidator";
import { CreateProductDto } from "../dto/product.dto";

const router = express.Router();
export const service = new CatalogService(new CatalogRepository());

router.post("/products", async (req, res, next) => {
  const { errors, input } = await requestValidator(CreateProductDto, req.body);
  if (errors) return res.status(400).json({ errors });

  const product = await service.createProduct(input);
  return res.status(201).json(product);
});

router.put(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { errors, input } = await requestValidator(
        CreateProductDto,
        req.body,
      );
      if (errors) return res.status(400).json({ errors });
      const product = await service.updateProduct({
        ...input,
        id: parseInt(req.params.id as string),
      });
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const products = await service.getProducts(limit, offset);
      return res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await service.getProduct(
        parseInt(req.params.id as string),
      );
      return res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/products/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await service.deleteProduct(parseInt(req.params.id as string));
      return res.status(200).json({});
    } catch (error) {
      next(error);
    }
  },
);

export default router;
