import { Subjects, Publisher, OrderCancelledEvent } from '@racf-pedalsound/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}