import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import path from "path";
import {fileURLToPath} from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('public'))

app.get("/home", (req, res) =>{
  res.render("prueba", {
    title:"Hola",
    message:"mensaje",
    name:"Neli"
  });
});

const PORT = 8080;
app.use(express.urlencoded({extended: true} ));
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);


app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });