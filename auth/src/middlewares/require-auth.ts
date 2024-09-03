import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

// Este middleware se llamará siempre despues del middleware
// de current-user. Debido a esto, si el middleware anterior
// falla, no se le da aceso al usuario que quiere hacer uso
// de la app.
export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }
    
    next();
};