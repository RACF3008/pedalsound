import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/use-request';

// Realizar el sign-up
const SignUp = () => {
    // Crear algunos hooks para el correo, contraseña y la consulta
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { errors, doRequest } = useRequest({ 
        url: '/api/users/signup', 
        method: 'post', 
        body: { 
            email, 
            password 
        },
        // Callback para redireccionar a la página principal si la 
        // consulta es exitosa
        onSuccess: () => Router.push('/')
    });

    // Al momento de enviar el formulario, realizar una consulta
    // utilizando el hook previamente mencionado (useRequest). Este
    // es para evitar la repetición de código, ya que se va a 
    // realizar varias consultar a lo largo de los demás servicios
    const onSubmit = async event => {
        event.preventDefault();

        // Se llama a la función dentro del hook useRequest
        await doRequest();
    };

    // Renderizar el formulario y conectar los hooks a la interfaz
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Correo Electrónico</label>
                <input 
                    value={email} 
                    onChange={e =>setEmail(e.target.value)} 
                    type="email" 
                    className="form-control" 
                />
            </div>
            <div className="form-group">
                <label>Contraseña</label>
                <input 
                    value={password} 
                    onChange={e =>setPassword(e.target.value)} 
                    type="password" 
                    className="form-control" 
                />
            </div>
            { errors }
            <button className="btn btn-primary">Sign Up</button>
        </form>
    );
};

export default SignUp;