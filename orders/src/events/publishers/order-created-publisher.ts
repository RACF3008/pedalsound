import { Publisher, OrderCreatedEvent, Subjects } from '@racf-pedalsound/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;

}