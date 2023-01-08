const socket = io();
console.log("Hola desde el cliente public");


// Send a message to the server
socket.emit("message", "Hola desde el cliente!");

socket.on("message", (newProduct) => {
  console.log(newProduct);
});

socket.on("product", (products) => {
  render(products);
});


document.getElementById("send").addEventListener("click", function () {
  console.log("hola hhhh");
  //get socket id
  const socketId = socket.id;
  const newProduct = {
    // name: document.getElementById("product").value,
    title: document.getElementById("product").value,
  };
  console.log(newProduct)
  document.getElementById("product").innerHTML = newProduct;
});


function render(products) {

  // products.map((elem) => {
    return`<div>${elem.title}</div> <div>hola desde html</div>`;
  }
  // )
  // .join(" ");
  // document.getElementById("product").innerHTML = products;
//};

