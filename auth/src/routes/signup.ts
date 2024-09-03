import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

// Manejar las consultas de tipo POST para la ruta /api/users/signup
router.post('/api/users/signup', 
[
    // Pasos previos para validar la información de la consulta
    body('email')                                                           // Validar el email...
        .isEmail()                                                          // Chequear si tiene la estructura correcta
        .withMessage('El correo debe ser válido'),                              // Enviar un mensaje si no es válido
    body('password')                                                        // Validar la contraseña...
        .trim()                                                             // Se asegura de que no hayan espacios en la contraseña
        .isLength({ min: 4, max: 20 })                                      // Debe tener entre 4 y 20 caracteres
        .withMessage('La contraseña debe tener entre 4 y 20 caracteres')
], 
validateRequest,
async (req: Request, res: Response) => {

    // Si no hay errores extraemos el correo y la contraseña
    const { email, password } = req.body;

    // Chequear si el correo ya se encuentra en uso
    const existingUser = await User.findOne({ email });

    // Si el correo ya está en uso...
    if (existingUser) {
        throw new BadRequestError('El correo ya está en uso');
    }

    // Si no existe, crear un nuevo usuario
    const user = User.build({ email, password});
    // Gaurdar el usuario en la BD de Mongo
    await user.save();

    // Generar JWT. Guardar los valores de user id y el email para validar la
    // autenticidad del usuario en otros servicios. Cabe mencionar que la llave
    // para la encriptacion de se del JWT es una variable de entorno. Además, 
    // Typescript no reconoce este tipo de variables, por lo que se agrega un
    // if antes para aclarar que será de tipo string.
    const userJwt = jwt.sign(
        {
            id: user.id,
            email: user.email
        }, 
        process.env.JWT_KEY!
    );
    // Guardar el JWT en el objeto de sesión
    req.session = {
        jwt: userJwt
    }

    // Contestamos con un codigo de creado con éxito
    res.status(201).send(user);
});

export { router as signupRouter }