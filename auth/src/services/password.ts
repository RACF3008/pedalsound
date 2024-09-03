import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        // Definir un salt (codigo aleatorio) para hashear la password
        const salt = randomBytes(8).toString('hex');
        // Hasehar la contraseña con el salt 64 veces
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;

        // Devolver el hash concatenado con el salt
        return `${buf.toString('hex')}.${salt}`;
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        // Separar el hash y el salt
        const [hashedPassword, salt] =  storedPassword.split('.');
        // Hshear la contraseña dada por el usuario y compararla con la
        // guardada en la base de datos
        const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        // Retornar si es igual la contraseña o no
        return buf.toString('hex') === hashedPassword;
    }
}