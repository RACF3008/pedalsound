import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

// Agregar el atributo de UserPayload al objeto de Request de
// Express para que Typescript lo reconozca.
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload;
        }
    }
}

export const currentUser = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    // Chequear si existe el objeto de session (cookie) o si el
    // atributo de jwt esta en session.
    if (!req.session?.jwt) {
        return next();
    }
    
    // Intentar verificar la información del JWT utilizando la variable
    // de entorno con la key. Si no el proceso se finaliza con éxito se
    // retorna el id, email y otra info. Se se presenta un error no se 
    // retorna nada.
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payload;
    } catch (err) {}

    next();
};

