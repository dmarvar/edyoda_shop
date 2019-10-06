let clothes = document.getElementById("clothesBoxes");
let accesories = document.getElementById("accesoriesBoxes");
let pathname = window.location.pathname;

if (pathname == "/" || pathname == "/index.html") {
  updateItemsCount();
  let req = new XMLHttpRequest();
  req.open("GET", "https://5d76bf96515d1a0014085cf9.mockapi.io/product", true);
  req.onreadystatechange = function(e) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        let obj = JSON.parse(req.responseText);
        obj.map(item => {
          let objBox = createBox(item);
          if (!item.isAccessory) {
            clothes.appendChild(objBox);
          } else {
            accesories.appendChild(objBox);
          }
        });
      } else console.log("Error loading page\n");
    }
  };
  req.send(null);
}

if (pathname == "/productDetail.html") {
  updateItemsCount();

  let id = window.location.search.substring(4);
  let req = new XMLHttpRequest();
  req.open(
    "GET",
    "https://5d76bf96515d1a0014085cf9.mockapi.io/product/" + id,
    true
  );
  req.onreadystatechange = function(e) {
    if (req.readyState == 4) {
      if (req.status == 200) {
        let obj = JSON.parse(req.responseText);
        let mainImg = document.createElement("img");
        let photos = document.getElementById("photos");
        mainImg.setAttribute("src", obj.photos[0]);
        document.getElementById("imgProductDetail").appendChild(mainImg);
        document.getElementById("pdTitle").innerHTML = obj.name;
        document.getElementById("pdPrice").innerHTML = `RS ${obj.price}`;
        document.getElementById("pdDescription").innerHTML = obj.description;
        obj.photos.map(item => {
          let img = document.createElement("img");
          img.addEventListener("click", () => {
            for (let i = 0; i < photos.children.length; i++) {
              photos.children[i].classList.remove("active");
            }
            mainImg.setAttribute("src", item);
            img.setAttribute("class", "active");
          });
          img.setAttribute("src", item);
          photos.appendChild(img);
        });
        // ADDING BUTTON FUNCTIONALITY
        document.getElementById("addToCar").addEventListener("click", e => {
          e.preventDefault();
          let storage = window.localStorage.car
            ? JSON.parse(window.localStorage.getItem("car"))
            : {};
          let count = storage[id] ? storage[id][0] + 1 : 1;
          storage[id] = [count, obj];
          window.localStorage.setItem("car", JSON.stringify(storage));
          // Updating Count from state
          updateItemsCount();
        });
      }
    } else console.log("Error loading page\n");
  };
  req.send(null);
}

if (pathname == "/checkout.html") {
  updateItemsCount();
  document.getElementById(
    "totalCountCheckout"
  ).innerHTML = `Total items: ${window.localStorage.getItem("total")}`;
  let itemsToRender = JSON.parse(window.localStorage.getItem("car"));
  // console.log(itemsToRender);
  let boxesParent = document.getElementById("boxesParent");
  Object.values(itemsToRender).map(item => {
    let newBox = document.createElement("div");
    let container = document.createElement("div");
    let title = document.createElement("h4");
    let quantity = document.createElement("span");
    let amount = document.createElement("p");
    let imgCheckout = document.createElement("img");
    title.innerHTML = item[1]["name"];
    quantity.innerHTML = "x " + item[0];
    amount.innerHTML = "Amount: RS" + item[0] * item[1]["price"];
    imgCheckout.setAttribute("src", item[1]["preview"]);
    container.appendChild(title);
    container.appendChild(quantity);
    container.appendChild(amount);
    newBox.appendChild(imgCheckout);
    newBox.appendChild(container);
    boxesParent.appendChild(newBox);
  });
  // Get Total Account
  let finalTotal = Object.values(itemsToRender).reduce(
    (a, b) => a + b[0] * b[1]["price"],
    0
  );
  document.getElementById("valueAmount").innerHTML = "RS " + finalTotal;
  // Adding button functionality
  document.getElementById("placeOrder").addEventListener("click", () => {
    let req = new XMLHttpRequest();
    req.open("POST", "https://5d76bf96515d1a0014085cf9.mockapi.io/order", true);
    req.onreadystatechange = function(e) {
      if (req.readyState == 4) {
        if (req.status == 200) {
          console.log(req.responseText);
        }
      } else {
        console.log("error");
      }
    };
    req.send(null);
    window.localStorage.setItem("total", 0);
    window.localStorage.removeItem("car");
    updateItemsCount();
    window.location.replace("/confirmation.html");
  });
}

function updateItemsCount() {
  let local = window.localStorage.getItem("car");
  let state = local ? JSON.parse(window.localStorage.getItem("car")) : {};
  let sum = Object.values(state).reduce((a, b) => a + b[0], 0);
  window.localStorage.setItem("total", sum);
  let itemsCount = document.getElementById("itemsCount");
  itemsCount.innerHTML = sum;
}

function createBox(obj) {
  let link = document.createElement("a");
  let box = document.createElement("div");
  let img = document.createElement("img");
  let textContainer = document.createElement("div");
  let title = document.createElement("h4");
  let span = document.createElement("span");
  let para = document.createElement("p");
  title.innerHTML = obj.name;
  span.innerHTML = obj.brand;
  para.innerHTML = `Rs ${obj.price}`;
  title.innerHTML = obj.name;
  box.setAttribute("class", "box");
  link.setAttribute("href", `/productDetail.html?id=${obj.id}`);
  img.setAttribute("src", obj.preview);
  textContainer.appendChild(title);
  textContainer.appendChild(span);
  textContainer.appendChild(para);
  box.appendChild(img);
  box.appendChild(textContainer);
  link.appendChild(box);
  return link;
}
