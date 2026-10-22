const cart = []
function addToCart(product) {
 const existing = cart.find(item => item.name === product.name);
 if (existing) {
    existing.qty++;
 } else{
cart.push({ name:product.name, price:product.price, qty:1, thumb:product.image.thumbnail })
 }
 renderCart();
}

function removeFromCart(name) {
const index = cart.findIndex(item => item.name === name);
if (index  !== -1) cart.splice(index,1);
renderCart()

}

function decreaseQty(name) {
const item = cart.find(i => i.name ===name);
if (!item)  return;
item.qty--;
if(item.qty === 0) {
    removeFromCart(name);
} else {
    renderCart();
}
}

function updateCards() {
    document.querySelectorAll(".product-card").forEach(card => {
        const item = cart.find(i => i.name === card.dataset.name);
        const inCart = Boolean(item);

     card.querySelector(".add-btn").classList.toggle("hidden", inCart);
        

        const qty = card.querySelector(".qty-control");
        qty.classList.toggle("hidden", !inCart);
        qty.classList.toggle("flex", inCart);
                  card.querySelector(".qty-num").textContent = item ? item.qty :1;


          const img = card.querySelector(".product-img");
          img.classList.toggle("border-red-500" , inCart);
         img.classList.toggle("border-transparent" , !inCart);

    });
}

function renderCart() {
    const list = document.getElementById("cart-items");
    let total = 0;
    let count = 0;
    list.innerHTML = "";

    if (cart.length === 0) {
        list.innerHTML = `<p class="text-gray-500">Your added items  will appear here</p>`
    }

    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;

        const row = document.createElement("div");
        row.className="flex justify-between items-center border-b py-3";
        row.innerHTML = `
        <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm">
        <span class="text-rose-700 font-semibold">${item.qty}x</span>
        @$${item.price.toFixed(2)}
       <span class="font-semibold"> $${(item.price * item.qty).toFixed(2)}</span>
        </p>
        </div>

        <button class ="remove-btn text-gray-400 hover:text-black text-xl"> <img src="assets/images/icon-remove-item.svg"> </button>


        `
        ;

        row.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(item.name));
        list.appendChild(row);

    })

    document.getElementById("cart-count").textContent = count;
    document.getElementById("empty-cart-img").classList.toggle("hidden", cart.length > 0);
    document.getElementById("cart-total").textContent = "$" + total.toFixed(2);
        document.getElementById("cart-footer").classList.toggle("hidden", cart.length === 0);

    updateCards();
}
renderCart();










fetch ("products.json")
.then(response => response.json())
.then(products => {
    const container = 
    document.getElementById("product-container");

    





    products.forEach(product => {
        const card =
        document.createElement("div");
        card.dataset.name = product.name;

        card.classList.add("product-card", "m-4", "rounded-md" ,"text-left","align-left", "justify-left", "display-grid");

        // card.class="m-4 p-3 rounded-md"

        card.innerHTML = `
           <div class="relative">
        <picture class="rounded-md">
        <source media = "(min-width:1024px)" srcset="${product.image.desktop}">
                <source media = "(min-width:640px)" srcset="${product.image.tablet}">

        <img src="${product.image.mobile}" alt="${product.name}" class="w-full product-img h-64 rounded-lg shadow  object-cover align-center border-2 border-transparent" >
       
       </picture>
        <button class="  add-btn absolute -bottom-7 left-1/2 -translate-x-1/2 flex  items-center bg-white gap-2 m-4 border rounded-full  px-6 py-2 text-sm font-semibold whitespace-nonwrap hover:bg-rose-500  w-max border-gray-300">
        <img src="assets/images/icon-add-to-cart.svg">
        Add to cart</button>

        <div class="qty-control  hidden absolute -bottom-7 left-1/2 -translate-x-1/2 w-40  items-center justify-between bg-red-500 text-white rounded-full px-3 py-2">
       
       
        <button class="minus-btn w-5 h-5 border border-white rounded-full flex items-center justify-center ">
        <img src="assets/images/icon-decrement-quantity.svg"/>
        </button>
     

        <span class="qty-num font-semibold">1</span>


        <button class="plus-btn w-5 h-5 border border-white rounded-full flex items-center justify-center leading-none">
        <img src="assets/images/icon-increment-quantity.svg"/>
        </button>

        </div>
        </div>
       <p class=" text-sm mt-8 text-gray-400">${product.category}</p>
       <h3 class="font-bold">${product.name}</h3>
       <p class="text-red-500  font-bold">$${product.price.toFixed(2)}</p>
        `;

// console.log(
//     card.querySelector(".add-btn"),
//     card.querySelector(".minus-btn"),
//     card.querySelector(".plus-btn")
// )


        card.querySelector(".add-btn").addEventListener("click", () => addToCart(product));
        card.querySelector(".minus-btn").addEventListener("click", () => decreaseQty(product.name));
        card.querySelector(".plus-btn").addEventListener("click", () => addToCart(product));
        
    //   function decreaseQty(name) {
    //     const item = cart.find(i => i.name === name);
    //     if (!item) return;
    //   item.qty--;
    //   if (item.qty === 0) {
    //     removeFromCart(name);

    //   }
    //   else{
    //     renderCart()
    //   }
    //   }

        container.appendChild(card);
    });
})

.catch(error => {
    console.error("Could not load products:", error);
});

const modal = document.getElementById("order-modal");
document.getElementById("confirm-btn").addEventListener("click", () => {
    const box = document.getElementById("order-items");
    let total=0;
    box.innerHTML = "" ;

    cart.forEach(item => {
    total += item.price * item.qty;
    box.innerHTML += `
      <div class="flex items-center gap-3 border-b py-3">
        <img src="${item.thumb}" alt="" class="w-12 h-12 rounded">
        <div class="flex-1">
          <p class="font-semibold">${item.name}</p>
          <p class="text-sm"><span class="text-rose-700 font-semibold">${item.qty}x</span> @ $${item.price.toFixed(2)}</p>
        </div>
        <p class="font-semibold">$${(item.price * item.qty).toFixed(2)}</p>
      </div>`;
  });

  box.innerHTML += `
    <div class="flex justify-between pt-4">
      <span>Order Total</span>
      <span class="text-2xl font-bold">$${total.toFixed(2)}</span>
    </div>`;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
});

document.getElementById("new-order-btn").addEventListener("click", () => {
  cart.length = 0;
  renderCart();
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});



