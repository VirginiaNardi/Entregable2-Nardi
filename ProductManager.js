const fs = require('fs');

class Product {
    constructor(title, description, price, thumbnail, code, stock, id) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

class ProductManager {
    constructor(path) {
        this.products = [];
        this.productIdCounter = 0; 
        this.path = path;
        this.loadProducts();
    }

    loadProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const data = fs.readFileSync(this.path, 'utf8');
                const parsedData = JSON.parse(data);
                if (Array.isArray(parsedData) && parsedData.length > 0) {
                    this.products = parsedData;
                    this.productIdCounter = Math.max(...parsedData.map(p => p.id)) + 1;
                }
            } else {
                this.products = [];
                this.productIdCounter = 1;
            }
        } catch (err) {
            console.log('Error al cargar los productos:', err.message);
        }
    }

    saveProducts() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (err) {
            console.log('Error al guardar los productos:', err.message);
        }
    }

    addProduct(product) {
        product.id = ++this.productIdCounter; // Incremento automático de id
        this.products.push(product);
        console.log(`El producto ${product.title} fue agregado con éxito`);
        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        let productFound = this.products.find(prod => prod.id === id);

        if (productFound) {
            console.log(`El producto con id: ${id} es:`);
            return productFound;
        } else {
            console.error(`Producto con id ${id} no encontrado`);
        }
    }

    updateProduct(id, updateProduct) {
        let productIndex = this.products.findIndex(prod => prod.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updateProduct, id: this.products[productIndex].id };
            this.saveProducts();
            console.log(`El producto con id ${id} fue actualizado con éxito`);
        } else {
            console.error(`El producto con id ${id} no fue encontrado`);
        }
    }

    deleteProduct(id) {
        let productIndex = this.products.findIndex(prod => prod.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveProducts();
            console.log(`Producto con id ${id} eliminado con éxito`);
        } else {
            console.error(`El producto con id ${id} no fue encontrado`);
        }
    }
}

const adminProducts = new ProductManager('productos.json');

const prueba1 = new Product('producto prueba', 'descripción producto prueba', 200, 'sin imagen', 'abc123', 25);
const prueba2 = new Product('producto prueba 2', 'descripción producto prueba 2', 100, 'sin imagen', 'abc456', 10);

// LLAMANDO A GETPRODUCTS() DEBE DEVOLVER ARRAY VACÍO
// console.log(adminProducts.getProducts());

// // AGREGANDO UN PRODUCTO DE PRUEBA
adminProducts.addProduct(prueba1);
adminProducts.addProduct(prueba2);

// // LLAMANDO A GETPRODUCTS() PARA VER SI APARECE EL PRODUCTO RECIÉN CREADO
// console.log(adminProducts.getProducts());

// // LLAMANDO AL PRODUCTO POR ID
//console.log(adminProducts.getProductById(2));

// // LLAMANDO PARA ACTUALIZAR EL PRODUCTO
// const updateProduct = {
//     title: 'producto actualizado',
//     price: 190,
// }
// adminProducts.updateProduct(2, updateProduct)

// //LLAMANDO PARA ELIMINAR EL PRODUCTO
// adminProducts.deleteProduct(2)