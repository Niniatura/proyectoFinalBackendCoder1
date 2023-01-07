import express from "express";
import productsRouter from "./routes/products.router.js";
import cartRouter from "./routes/cart.router.js";
import { engine } from "express-handlebars";
import path from "path";
import {fileURLToPath} from 'url';
import { productsLists } from "./productList/productList.js";
import { Server } from 'socket.io';
import { pruebaRouter} from './routes/views.router.js';

const app = express();
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
const socketServer = new Server(httpServer);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.static('public'));

app.use(express.urlencoded({extended: true} ));
app.use(express.json());

// app.use("/api/carts", cartRouter);
// app.get("/realtimeproducts", (req, res) =>{
//   res.send("hola mundo");
// });
// app.get("/realtimeproducts", realTimeRouter);
app.post("/", pruebaRouter, function (req, res) {
  socketServer.on("connection", (socket) =>{
    console.log("nuevo cliente conectado");
  socket.emit(products);
  })
})
app.get("/api/products", pruebaRouter);

app.get('/realtimeproducts', pruebaRouter, function (req, res) {
  socketServer.on("connection", (socket) =>{
    console.log("nuevo cliente conectado realtime");
  socket.emit(products);
  })
});

// socketServer.on("connection", (socket) =>{
//   console.log("nuevo cliente conectado");
//   socket.emit("message", "Bienvenido!");
//   socket.on("message", (products)=>{
//     // console.log("productos en el listado"+products)
//   })
// })
