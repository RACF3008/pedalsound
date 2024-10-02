import { Publisher, Subjects, ProductUpdatedEvent } from "@racf-pedalsound/common";

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
    readonly subject = Subjects.ProductUpdated;
}