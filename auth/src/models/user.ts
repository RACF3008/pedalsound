import mongoose from 'mongoose';
import { Password } from '../services/password';

// Una interfaz que describe las propiedades de un nuevo usuario
interface UserAttrs {
    email: string;
    password: string;
}

// Interfaz que descibre las propiedades que tiene un modelo de 
// usuario (colección de varios usuarios)
interface UserModel extends mongoose.Model<UserDoc> {
 build(attrs: UserAttrs): UserDoc;
}

// Interfaz que describe las propiedades de un documento de usuario
// (un solo usuario)
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}
// Nota: Se aplica un objeto que dentro tiene la función de toJSON
// para personalizar algunas propiedades que se retornan al usuario,
// ya sea para eliminar algunas o para formatear otras. Aquí se hace
// para no retornar el campo de password ni de __V, además de cambiar
// la llave de _id por solamente id.
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// Nota: en este caso no se utiliza una función de flecha ya
// que si se utilizara esa sintaxis no se podría usar this. Esto
// porque this estaría haciendo referencia al documento como tal y no
// al esquema de userSchema que se creó.
userSchema.pre('save', async function(done) {
    // Chequear si la contraseña cambió
    if (this.isModified('password')) {
        // Si sí cambió, realizar el hash a la nueva contraseña
        const hashed = await Password.toHash(this.get('password'));
        // Actualizar la contraseña con la nueva contraseña hasheada
        this.set('password', hashed);
    }
    // Mongoose utiliza una forma vieja para las funciones asíncronas y
    // hay que decirle cuando ya se terminó el trabajo en la función
    done();
});

// Debido a que TypeSrcipt no trabaja muy bien junto con Mongoose, se
// crean algunas funciones como "mediadores" para que TypeScript reaccione
// al estar escribiendo código. Lo de abajo sirve para indicar que se puede
// utilizar la sintaxis de User.build(attrs), que es un poco más consistente
// con la forma habitual de crear una instancia.
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };