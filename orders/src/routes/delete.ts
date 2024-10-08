import express, { Request, Response } from 'express';

import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@racf-pedalsound/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const orderId = req.params;

    const order = await Order.findById(orderId.orderId).populate('product');
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // Publicar un evento de orden cancelada
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      product: {
        id: order.product.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
