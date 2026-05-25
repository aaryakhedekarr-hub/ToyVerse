
const products=[
{id:1,name:"Classic Barbie Doll",imageSrc:"https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=1200&auto=format&fit=crop",price:29,category:"Barbie"},
{id:2,name:"Toy Racing Car",imageSrc:"https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",price:18,category:"Boys Toys"},
{id:3,name:"Educational Puzzle",imageSrc:"https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop",price:15,category:"Educational"},
{id:4,name:"Cute Teddy Bear",imageSrc:"https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=1200&auto=format&fit=crop",price:20,category:"Plush"},
{id:5,name:"Princess Barbie Set",imageSrc:"https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1200&auto=format&fit=crop",price:35,category:"Barbie"},
{id:6,name:"Building Blocks",imageSrc:"https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=1200&auto=format&fit=crop",price:22,category:"Educational"},
{id:7,name:"Robot Toy",imageSrc:"https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=1200&auto=format&fit=crop",price:30,category:"Robot"},
{id:8,name:"Soft Bunny Plush",imageSrc:"https://images.unsplash.com/photo-1615486363973-f79f0a6d3f89?q=80&w=1200&auto=format&fit=crop",price:16,category:"Plush"}
];

function getCart(){
return JSON.parse(localStorage.getItem("cart"))||[];
}

function saveCart(cart){
localStorage.setItem("cart",JSON.stringify(cart));
}

function updateCartCount(){
const count=getCart().reduce((total,item)=>total+item.quantity,0);
const el=document.getElementById("cart-count");
if(el){el.innerText=count;}
}

function addToCart(id){
const cart=getCart();
const product=products.find(p=>p.id===id);
const existing=cart.find(item=>item.id===id);

if(existing){
existing.quantity+=1;
}else{
cart.push({...product,quantity:1});
}

saveCart(cart);
updateCartCount();
alert(product.name+" added to cart!");
}

function displayProducts(containerId,limit=null){
const container=document.getElementById(containerId);
if(!container) return;

const items=limit?products.slice(0,limit):products;

container.innerHTML=items.map(product=>`
<div class="product-card">
<img src="${product.imageSrc}" alt="${product.name}">
<div class="product-info">
<h3>${product.name}</h3>
<p class="price">$${product.price}</p>
<a href="product-detail.html?id=${product.id}" class="btn">View Details</a>
<button class="btn secondary-btn" onclick="addToCart(${product.id})">Add to Cart</button>
</div>
</div>
`).join("");
}

function displayProductDetail(){
const container=document.getElementById("product-detail");
if(!container) return;

const params=new URLSearchParams(window.location.search);
const id=Number(params.get("id"));

const product=products.find(p=>p.id===id);
if(!product) return;

container.innerHTML=`
<img src="${product.imageSrc}" alt="${product.name}">
<div>
<h1>${product.name}</h1>
<p class="price">$${product.price}</p>
<p>A fun toy designed to inspire imagination and creativity.</p>

<div class="quantity-controls">
<input type="number" id="quantity" min="1" value="1">
</div>

<button class="btn" onclick="addDetailToCart(${product.id})">Add To Cart</button>
</div>
`;
}

function addDetailToCart(id){
const quantity=Number(document.getElementById("quantity").value);
const cart=getCart();
const product=products.find(p=>p.id===id);
const existing=cart.find(item=>item.id===id);

if(existing){
existing.quantity+=quantity;
}else{
cart.push({...product,quantity});
}

saveCart(cart);
updateCartCount();
alert("Product added successfully!");
}

function renderCart(){
const container=document.getElementById("cart-items");
const totalEl=document.getElementById("cart-total");

if(!container||!totalEl) return;

const cart=getCart();

if(cart.length===0){
container.innerHTML="<p>Your cart is empty.</p>";
totalEl.innerText="0";
return;
}

let total=0;

container.innerHTML=cart.map(item=>{
total+=item.price*item.quantity;

return `
<div class="cart-item">
<img src="${item.imageSrc}">
<div>
<h3>${item.name}</h3>
<p>$${item.price}</p>

<div class="quantity-controls">
<button class="btn" onclick="changeQuantity(${item.id},-1)">-</button>
<span>${item.quantity}</span>
<button class="btn" onclick="changeQuantity(${item.id},1)">+</button>
</div>

<button class="btn secondary-btn" onclick="removeItem(${item.id})">Remove</button>
</div>
</div>
`;
}).join("");

totalEl.innerText=total;
}

function changeQuantity(id,amount){
let cart=getCart();

cart=cart.map(item=>{
if(item.id===id){
item.quantity+=amount;
if(item.quantity<1){
item.quantity=1;
}
}
return item;
});

saveCart(cart);
renderCart();
updateCartCount();
}

function removeItem(id){
let cart=getCart();
cart=cart.filter(item=>item.id!==id);

saveCart(cart);
renderCart();
updateCartCount();
}

document.addEventListener("DOMContentLoaded",()=>{
updateCartCount();

displayProducts("featured-products",4);
displayProducts("shop-products");

displayProductDetail();

renderCart();

const checkout=document.getElementById("checkout-form");

if(checkout){
checkout.addEventListener("submit",(e)=>{
e.preventDefault();
alert("Order placed successfully!");
localStorage.removeItem("cart");
window.location.href="index.html";
});
}

const contact=document.getElementById("contact-form");

if(contact){
contact.addEventListener("submit",(e)=>{
e.preventDefault();
alert("Message sent successfully!");
contact.reset();
});
}
});
