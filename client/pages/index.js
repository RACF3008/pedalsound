import axios from 'axios';

const LandingPage = ({ currentUser }) => {
    // console.log(currentUser);
    // axios.get('/api/users/currentuser').catch((err) => {
    //     console.log(err.message);
    // });
    // console.log("I was executed");
    console.log(currentUser);

    return <h1>Landing Page</h1>;
};

LandingPage.getInitialProps = async ({ req }) => {
    // si no existe un objeto de window (que se existe únicamente del
    // lado del cliente) es porque estamos en el servidor.
    try {
        console.log(req.headers);
        if (typeof window === "undefined") {
            // Ejecutado en el servidor de Next JS
            console.log("From Next JS");
            const { data } = await axios.get(
                'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
                {
                    headers: req.headers
                }
            );
            return data;
        } else {
            // Ejecutado en el navegador del cliente
            const { data } = await axios.get('/api/users/currentuser');
            return data;
        }
    } catch (err) {
        console.error('Error fetching current user:', error.message);
        return { currentUser: null }; // Devuelve null si hay algún error
    }
};

export default LandingPage;