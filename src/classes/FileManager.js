import fs from "fs";

class FileManager{
    constructor(filePath){
    this.filePath = filePath;
    }
    
    async getAll() {
        try {
          const data = await fs.promises.readFile(this.filePath);
          return JSON.parse(data);
        } catch (err) {
          throw err;
        }
      }
    
      async writeAll(data) {
        try {
          await fs.promises.writeFile(this.filePath, JSON.stringify(data));
        } catch (err) {
          throw err;
        }
      }
    
    
}
class ProductFileManager extends FileManager {
    async getProductById(id) {
        try {
          const data = await fs.promises.readFile(this.filePath);
          this.products = JSON.parse(data);
          const product = this.products.find((product) => product.id === id);
          if(product){
            return product;
          }else{
            return res.status(404).send('No hay productos con ese id');
          }
        } catch (err) {
          throw err;
        }
      }

    async add(product) {
        try {
          const products = await this.getAll();
          products.push(product);
  
          await this.writeAll(products);
        } catch (err) {
          throw err;
        }
      }

     
}

class cartFileManager extends FileManager { 

      async getCartById(id) {
        try {
          const data = await fs.promises.readFile(this.filePath);
          this.carts = JSON.parse(data);
          const cart = this.carts.find((cart) => cart.id === id);
          if(cart){
            return cart;
          }else{
            return res.status(404).send('No hay carrito con ese id');
          }
        } catch (err) {
          throw err;
        }
      }
}
export {FileManager, ProductFileManager, cartFileManager};