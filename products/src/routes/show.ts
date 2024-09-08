import express, { Request, Response } from 'express';
import { NotFoundError } from '@racf-pedalsound/common';
import { Product } from '../models/product';

const router = express.Router();

router.get('/api/products/:id', async (req: Request, res: Response) => {
    // Buscar el producto en la base de datos con el modelo de Product
    const product = await Product.findById(req.params.id);

    // Si no se encontro el producto
    if (!product) {
        throw new NotFoundError();
    }

    res.send(product);
});

export { router as showProductRouter };