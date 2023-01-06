// import express from "express";
// // import productsRouter from "./routes/products.router.js";

// const router = express.Router();

// const pruebaRouter = router.get("/api/products", (req, res) =>{
//     console.log("desde el servidor");
//     res.render("home",{})
//   });

// export default pruebaRouter;


import express from "express";
import { FileManager, ProductFileManager } from "../classes/FileManager.js";
import { v4 } from "uuid";
import path from "path";

const productsRouter = express.Router();
const fileManager = new FileManager(
    path.resolve(process.cwd(), "public", "products.json")
  );
  const productFileManager = new ProductFileManager(
    path.resolve(process.cwd(), "public", "products.json")
  );
const pruebaRouter = productsRouter.get("/api/products", async (req, res, render) => {
    const { limit } = req.query;

    try {
        const products = await fileManager.getAll();

        if (limit) {
            return res.send(products.slice(0, limit));
        
        }
        
        return res.status(200).render('home',{ title: products });

    } catch (err) {
        return res.status(500).send(err.message);
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
    const products = await fileManager.getAll();

    await fileManager.writeAll([...products, newProduct]);
    res.send(newProduct);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const newProduct = {
        id:pid,
        ...req.body
    }
  
    try {
      const products = await fileManager.getAll();
      const productIndex = products.findIndex((product) => product.id === pid);
      if (productIndex === -1) {
        res.status(404).send("Producto no encontrado");
        return;
      }
  
      products[productIndex] = newProduct;
      await fileManager.writeAll(products);
      res.send(newProduct);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
  
    try {
      const products = await fileManager.getAll();
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