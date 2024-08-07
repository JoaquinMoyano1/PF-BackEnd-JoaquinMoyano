
const faker = require('faker');

function generateMockProducts(count = 100) {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push({
            id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            stock: faker.datatype.number({ min: 0, max: 100 })
        });
    }
    return products;
}

module.exports = generateMockProducts;
