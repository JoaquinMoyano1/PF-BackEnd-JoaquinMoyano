class ProductDTO {
    constructor({ id, name, price, category, available }) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.available = available;
    }
}

module.exports = ProductDTO;
