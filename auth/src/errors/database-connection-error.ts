import { CustomError } from "./custom-error";

// Esta sub-clase de Error se utiliza para dar más detalles sobre algún error dentro
// de una consulta a la base de datos directamente.
export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error al conectarse a la base de datos';

    constructor() {
        // Cuando se tiene un constructor en una subclase es necesario llamar a la 
        // superclase utilizando super().
        super('Error al establecer conexión con la base de datos');

        // Porque estamos extendiendo la clase Error
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeErrors() {
        return [{ message: this.reason }];
    }
}