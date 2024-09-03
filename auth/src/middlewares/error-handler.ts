import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

// Esta middleware se encarga de manejar los errores y responder a nuestra aplicación
// de React.js con una estructura consistente para facilitar la creación de mensajes 
// de error
export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
) => {

    // Si el error es una instancia de CustomError, se retorna alguna respuesta 
    // dependiendo del error. Aquí llamamos a CustomError ya que es una clase abstracta
    // y se encarga de referenciar a todas las subclases de tipo CustomError.
    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() });
    }

    // Crear la estructura consistente
    res.status(400).send({ 
        errors: [{ message: 'Algo salió mal...' }]
    });
};