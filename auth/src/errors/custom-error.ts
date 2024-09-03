// Esta es una clase abstracta, que se refiere a una clase utilizada como "plano" para
// crear otras suclases. En este caso, esta clase abstracta se define para poder 
// asegurar que todas las subclases tengan los mismos componentes, tanto las 
// propiedades como los métodos.
export abstract class CustomError extends Error {
    abstract statusCode: number;

    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, CustomError.prototype);
    }

    // Este es un método abstracto, en donde se define que todas las subclases de
    // CustomError deben tener un método de serializeErrors. Con TypeScript, se
    // define que este método retorna un objeto con las propiedades message y field.
    abstract serializeErrors(): { message: string; field?: string }[];
}