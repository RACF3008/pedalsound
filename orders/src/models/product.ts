import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

import { Order, OrderStatus } from '../models/order';

// Este archivo define el modelo de Producto que le sirve
// específicamente al servicio de ordenes. Por ejemplo,
// productos puede tener más características en su modelo
// como la marca, descripción, fecha de ingreso, etc., pero 
// esto no le interesa al servicio de ordenes.

interface ProductAttrs {
    id?: string;
    title: string;
    price: number;
}

export interface ProductDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<ProductDoc | null>;
}

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

// SIN UTILIZAR EL PLUGIN DE ACTUALIZACION DE VERSIONES
// productSchema.pre('save', function(done) {
//     // @ts-ignore
//     this.$where = {
//         version: this.get('version') - 1
//     };

//     done();
// });

productSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Product.findOne({
        _id: event.id,
        version: event.version - 1
    });
}
productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};
// Buscar entre todas las ordenes el producto que se desea ordenar.
// y que el estado de la orden no sea "cancelada". Si se encuentra,
// una orden con dichos criterios es que el producto está reservado.
// this ==> el documento de producto con el que se llamó a esta función
productSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        product: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    });

    // retorna un booleano, por lo que si sí hay un registro con dichas
    // propiedades, este se negará haciendose false y luego true otra vez.
    // Lo mismo sucede si no se encuentra un registro, se retornará false
    // al final.
    return !!existingOrder;
}

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export { Product };