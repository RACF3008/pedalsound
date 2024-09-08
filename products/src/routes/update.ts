import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    validateRequest,
    NotFoundError,
    requireAuth,
    NotAuthorizedError
} from '@racf-pedalsound/common';
import { Product } from '../models/product';

const router = express.Router();

router.put(
    '/api/products/:id', 
    // Requiere que el usuario este autenticado
    requireAuth, 
    // Realizar algunos chequeos
    [
        body('title')
            .not()
            .isEmpty()
            .withMessage('El nuevo tiítulo es requrido'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('El nuevo precio debe ser mayor que 0')
    ],
    // Validar que no hayan errores en la consulta
    validateRequest,
    async (req: Request, res: Response) => {
        const product = await Product.findById(req.params.id);

        if (!product) {
            throw new NotFoundError();
        }

        if (product.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        product.set({
            title: req.body.title,
            price: req.body.price
        });
        await product.save();

        res.send(product);
    }
);

export { router as updateProductRouter };