import { Publisher, Subjects, ProductCreatedEvent } from "@racf-pedalsound/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
    readonly subject = Subjects.ProductCreated;
}