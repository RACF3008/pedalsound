import { Product } from '../product';

it('implements optimistic concurrency control', async () => {
    // Crear una instancia de producto
    const product = Product.build({
        title: 'test title',
        price: 10,
        userId: 'fakeuser123'
    })

    // Guardar el producto en la base de datos
    await product.save();

    // Extraer el producto dos veces
    const firstInstance = await Product.findById(product.id);
    const secondInstance = await Product.findById(product.id);

    // Actualizar ambos productos 
    firstInstance!.set({ price: 15 });
    secondInstance!.set({ price: 25 });

    // Guardar el primer producto obtenido
    await firstInstance!.save();

    // Guardar el segundo producto obtenido y esperar un error
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('increments version number on multiple saves', async () => {
    const product = Product.build({
        title: 'test title',
        price: 10,
        userId: 'fakeuser123'
    });

    await product.save();
    expect(product.version).toEqual(0);
    await product.save();
    expect(product.version).toEqual(1);
    await product.save();
    expect(product.version).toEqual(2);
});