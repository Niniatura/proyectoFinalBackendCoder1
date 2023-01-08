const socket = io();
console.log("Hola desde el cliente public");


// Send a message to the server
socket.emit("message", "Hola desde el cliente!");

socket.on("message", (data) => {
  console.log(data);
});

socket.on("messages", (data) => {
  render(data);
});


document.getElementById("send").addEventListener("click", function () {
  console.log("hola hhhh");
  //get socket id
  const socketId = socket.id;
  const newProduct = {
    // name: document.getElementById("product").value,
    product: document.getElementById("product").value,
  };
  console.log(newProduct)
  document.getElementById("product").innerHTML = newProduct;
});


function render(data) {
  var source   = document.getElementById("template").innerHTML=html;
var template = Handlebars.compile(source);

  var html = template(data);
  document.getElementById("product").innerHTML=newProduct;
  // products.map((elem) => {
  //   return`<div>${elem.title}</div> <div>hola desde html</div>`;
  // })
  // .join(" ");
  // document.getElementById("product")
  // document.getElementById("product").innerHTML = html;
};

