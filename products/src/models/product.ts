import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Definir los atributos que tendra el modelo
// de producto
interface ProductAttrs {
    title: string;
    price: number;
    userId: string;
}

interface ProductDoc extends mongoose.Document{
    title: string;
    price: number;
    userId: string;
    version: number;
}

interface ProductModel extends mongoose.Model<ProductDoc> {
    build(attrs: ProductAttrs): ProductDoc;
}

const productSchema = new mongoose.Schema({
    // Definir los atributos de MongooseDB, por eso
    // se escribe String con mayúscula
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    // Transformar los nombres de las propiedades (como _id)
    // a un formato más común, como (como id).
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// Configurar el nombre del atributo de versión como "version"
productSchema.set('versionKey', 'version');

// Añadir el plugin de actualización de versiones
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
    return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>('Product', productSchema);

export { Product };