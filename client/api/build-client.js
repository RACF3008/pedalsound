import axios from 'axios';

export default ({ req }) => {

    if (typeof window === 'undefined') {
        // Del lado del servidor
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        // Del lado del cliente
        return axios.create({
            baseURL: '/'
        })
    }
};