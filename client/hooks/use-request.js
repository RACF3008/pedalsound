import axios from 'axios';
import { useState } from 'react';

// Crear un hook para realizar peticiones 
const useRequest = ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    // Realizar la consulta
    const doRequest = async () => {
        try {
            // Limpiar los errores para que estos no aparezcan si la
            // petición es correcta
            setErrors(null);

            // Asegurarse de que el método sea una cadena válida
            if (typeof method !== 'string' || !['get', 'post', 'put', 'delete', 'patch'].includes(method.toLowerCase())) {
                throw new Error(`Método HTTP inválido: ${method}`);
            }

            // Realizar la petición a la url indicada, utilizando el 
            // método y el body indicados
            const response = await axios[method](url, body);

            // Si la peticion es exitosa, enviar de regreso una
            // respuesta
            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        } catch (err) {
            console.log(err);
            // Lanzar errores renderizados
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oooops...</h4>
                    <ul className='my-0'>
                        {err.response.data.errors.map(err => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    };

    return { errors, doRequest };
};

export default useRequest;