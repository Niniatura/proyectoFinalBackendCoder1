import express from "express";
import { cartFileManager ,ProductFileManager} from "../classes/FileManager.js";
import { v4 } from "uuid";
import path from "path";

const cartRouter = express.Router();
const cartManager = new cartFileManager(
    path.resolve(process.cwd(), "public", "carts.json")
);
const productManager = new ProductFileManager(
    path.resolve(process.cwd(), "public", "products.json")
);

cartRouter.get("/", async (req, res) => {
try {
    const carts = await cartManager.getAll();
    res.send(carts);
} catch (err) {
    res.status(500).send(err.message);
}
});

cartRouter.post("/", async(req,res) =>{
    const newCart = {
        id: v4(),
        products:[]
    }
    try{
    const carts = await cartManager.getAll();
    await cartManager.writeAll([...carts, newCart]);
    res.send(newCart);
    } catch (err) {
    res.status(500).send(err.message);
    }
});


cartRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
    const carts = await cartManager.getCartById(cid);

    res.send(carts);
    return;
    
    } catch (err) {
    res.status(500).send(err.message);
    }
});

cartRouter.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const carts = await cartManager.getAll();
      const cart = carts.find((cart) => cart.id === cid);
      if (!cart) {
        res.status(404).send("Carrito no encontrado");
        return;
      }
      const products = await productManager.getAll();
      const product = products.find((product) => product.id === pid);
      if (!product) {
        res.status(404).send("Producto no encontrado");
        return;
      }
      const productInCart = cart.products.find((product) => product.id === pid);
      if (productInCart) {
        productInCart.quantity++;
        await cartManager.writeAll(carts);
        res.send("Producto agregado al carrito");
        return;
      } else {
        cart.products.push({ id: pid, quantity: 1 });
        await cartManager.writeAll(carts);
        res.send("Producto agregado al carrito");
        return;
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  cartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const { cid , pid } = req.params;
  
    try {
      const cart = await cartManager.getCartById(cid);
      const productInCart = cart.products.find((product) => product.id === pid);
      if (productInCart) {
        if (productInCart.quantity > 1) {
          productInCart.quantity--;
          await cartManager.writeAll([cart]);
          res.send("Producto eliminado del carrito");
          return;
        } else {
          cart.products = cart.products.filter((product) => product.id !== pid);
          await cartManager.writeAll([cart]);
          res.send("Producto eliminado del carrito");
          return;
        }
      } else {
        res.status(404).send("Producto no encontrado en el carrito");
        return;
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  cartRouter.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
  
    try {
      const carts = await cartManager.getAll();
      const cart = carts.find((cart) => cart.id === cid);
      if (!cart) {
        res.status(404).send("Carrito no encontrado");
        return;
      }
      const newCarts = carts.filter((cart) => cart.id !== cid);
      await cartManager.writeAll(newCarts);
      res.send("Carrito eliminado");
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

export default cartRouter;

