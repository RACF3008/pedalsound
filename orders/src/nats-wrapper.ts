import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan; // ? indica que es opcional y que puede ser indefinido por cierto tiempo


    get client() {
        if (!this._client) {
            throw new Error('No es posible acceder al cliente de NATS antes de conectarse');
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('Conectado a NATS');
                resolve();
            });
            this.client.on('error', (err) => {
                reject(err); 
            });
        });
    }
}

export const natsWrapper = new NatsWrapper();