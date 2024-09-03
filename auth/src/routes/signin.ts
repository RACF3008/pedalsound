import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

// Cheaquear la información de consulta de ingreso (sign-in).
// Todos los campos deben estar llenos.
router.post('/api/users/signin', 
    [
        body('email')
            .isEmail()
            .withMessage('El correo debe ser válido'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('La contraseña es obligatoria')
    ],
    // Se llama al middleware para revisar que no hayan errores
    // de validación.
    validateRequest,
    // Comienza la lógica de sign-in
    async (req: Request, res: Response) => {
        // Tomar el correo y la contraseña del body de la consulta
        const { email, password } = req.body;

        // Chequear si el correo existe en la BD
        const existingUser = await User.findOne({ email });
        // Si no existe...
        if (!existingUser) {
            // Lanzar un error genérico sobre que las credenciales
            // son incorrectas
            throw new BadRequestError('Credenciales inválidas');
        }

        // Si existe, chequear que la contraseña sea correcta. Para
        // esto utilizamos el servicio de Password, específicamente
        // el método de .compare.
        const passwordMatch = await Password.compare(existingUser.password, password);
        // Si las contraseñas no coinciden...
        if (!passwordMatch) {
            // Enviar un error general
            throw new BadRequestError('Credenciales inválidas');
        }

        // Crear el JWT y guardarlo en una cookie
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email
            }, 
            process.env.JWT_KEY!
        );
        // Guardar el JWT en el objeto de sesión
        req.session = {
            jwt: userJwt
        }

        // Contestar con un mensaje de exito
        res.status(200).send(existingUser);
    }
);

export { router as signinRouter }