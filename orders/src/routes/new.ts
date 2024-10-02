import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@racf-pedalsound/common';
import { Product } from '../models/product';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 30;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('productId')
      .not()
      .isEmpty()
      // chequear que el ID sea un ID de mongo
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('El ID del producto es obligatorio'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // Encontrar el producto que el usuario desea ordenar
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError();
    }

    // Asegurar que el producto que se está intentando ordenar no está
    // reservado.
    const isReserved = await product.isReserved();
    if (isReserved) {
      throw new BadRequestError('El producto ya se encuentra reservado');
    }

    // Calcular la fecha de expiración de la orden
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Crear la orden y guardarla en la BD.
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      product,
    });
    await order.save();

    // Publicar un evento de que la orden fue creada.
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      product: {
        id: product.id,
        price: product.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
