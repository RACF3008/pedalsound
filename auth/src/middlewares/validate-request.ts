import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

// Este middleware se encarga de validar si existe algun error de validatión.
// Más que todo es útil para no estar repitiendo el mismo código en todos los
// servicios que chequean la validación como sign-up y sign-in.
export const validateRequest = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array());
    }

    next();
};