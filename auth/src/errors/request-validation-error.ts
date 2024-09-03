import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

// Esta sub-clase de Error se utiliza para dar más detalles sobre algún error dentro
// de una consulta realizada.
export class RequestValidationError extends CustomError {
    statusCode = 400;

    constructor(public errors: ValidationError[]) {
        // Cuando se tiene un constructor en una subclase es necesario llamar a la 
        // superclase utilizando super().
        super('Parámetros incorrectos en la solicitud');

        // Porque estamos extendiendo la clase Error
        Object.setPrototypeOf(this, RequestValidationError.prototype);
    }

    serializeErrors() {
        return this.errors.map((err) => {
            if (err.type === 'field') {
                return { message: err.msg, field: err.path };
            }
            return { message: err.msg };
        });
    }
}