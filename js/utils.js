export default function createBox(obj) {
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
