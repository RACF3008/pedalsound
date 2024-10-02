import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@racf-pedalsound/common';
import { Product } from '../models/product';
import { ProductCreatedEvent } from '@racf-pedalsound/common';
import { ProductCreatedPublisher } from '../events/publishers/product-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/products', 
    // Chequear si el usuario está autenticado
    requireAuth, 
    // Validar la consulta
    [
        // Validar el titulo del producto
        body('title')
            .not()
            .isEmpty()
            .withMessage('El tiítulo es requrido'),
        // Validar el precio del producto (mayor a 0, flotante)
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('El precio debe ser mayor que 0')
    ],
    // Verificar que no hay errores de validación
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;

        const product = Product.build({
            title,
            price,
            userId: req.currentUser!.id
        });
        
        await product.save();
        new ProductCreatedPublisher(natsWrapper.client).publish({
            id: product.id,
            title: product.title,
            price: product.price,
            userId: product.userId,
            version: product.version
        });

        res.status(201).send(product);
    }
);

export { router as createProductRouter };