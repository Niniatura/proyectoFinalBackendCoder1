import express from "express";
import { FileManager } from "../classes/FileManager.js";
import { v4 } from "uuid";
import path from "path";

const productsRouter = express.Router();
const productFileManager = new FileManager(
    path.resolve(process.cwd(), "public", "products.json")
  );

productsRouter.get("/", async (req, res) => {
    const { limit } = req.query;

    try {
        const products = await productFileManager.getProducts();

        if (limit) {
        res.send(products.slice(0, limit));
        return;
        }

        res.send(products);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

productsRouter.get("/:pid", async (req, res) => {
    const { pid } = req.params;

    try {
    const products = await productFileManager.getProductById(pid);

    res.send(products);
    return;
    
    } catch (err) {
    res.status(500).send(err.message);
    }
});

productsRouter.post("/", async (req, res) => {
    const newProduct = {
        id:v4(),
        ...req.body
    }
    
    try {
    const products = await productFileManager.getProducts();

    await productFileManager.writeAll([...products, newProduct]);
    res.send(newProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const newProduct = req.body;
  
    try {
      const products = await productFileManager.getProducts();
      const productIndex = products.findIndex((product) => product.id === pid);
      if (productIndex === -1) {
        res.status(404).send("Producto no encontrado");
        return;
      }
  
      products[productIndex] = newProduct;
      await productFileManager.writeAll(products);
      res.send(newProduct);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
  
    try {
      const products = await productFileManager.getProducts();
      const productIndex = products.findIndex((product) => product.id === pid);
      if (productIndex === -1) {
        res.status(404).send("Producto no encontrado");
        return;
      }
  
      products.splice(productIndex, 1);
      await productFileManager.writeAll(products);
      res.send("Producto eliminado");
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

export default productsRouter;
