const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDom = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDom = document.querySelector(".products-center");
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const getData = async () => {
  let results = await (await fetch("products.json")).json();
  let products = results.items;
  products = products.map((item) => {
    let { title, price } = item.fields;
    let id = item.sys.id;
    let image = item.fields.image.fields.file.url;
    return { id, title, price, image };
  });
  return products;
};

// display products

const displayProduct = (products) => {
  try {
    let myproduct = "";
    products.forEach((product) => {
      myproduct += `
        <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img
              src="${product.image}"
              alt="product"
              class="product-img"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fas-shopping-cart"></i>
              add to bag
            </button>
          </div>
          <h3> ${product.title} </h3>
          <h4>$${product.price}</h4>
        </article>
        <!-- end of single product -->`;
    });
    productsDom.innerHTML = myproduct;
  } catch (err) {
    console.log(err);
  }
};

const selectBagBtns = () => {
  const addCartBtns = [...productsDom.querySelectorAll(".bag-btn")];
  addCartBtns.forEach((btn) => {
    chekcart(btn);
    btn.onclick = (e) => {
      let productId = e.target.dataset.id;
      getproduct(productId)
        .then((data) => {
          cart.push(data[0]);
        })
        .then(() => {
          localStorage.setItem("cart", JSON.stringify(cart));
          btn.innerHTML = "incart";
          btn.disabled = true;
          showCart();
          updateCartUi();
        });
    };
  });
};
document.addEventListener("DOMContentLoaded", () => {
  let products = getData();
  products
    .then((products) => {
      displayProduct(products);
    })
    .then(() => selectBagBtns())
    .then(() => updateCartUi())
    .then(() => selectClearCartItemBtns());
});
const getproduct = async (productId) => {
  let cartItem = await getData();
  cartItem = cartItem.filter((items) => items.id == productId);
  cartItem = cartItem.map((item) => {
    let { id, title, price, image } = item;
    return { id, title, price, image, amount: 1 };
  });
  return cartItem;
};
const chekcart = (btn) => {
  btnfind = cart.find((data) => data.id == btn.dataset.id);
  if (btnfind) {
    btn.innerHTML = "incart";
    btn.disabled = true;
  }
};
closeCartBtn.onclick = () => {
  cartDom.classList.remove("showCart");
  cartOverlay.classList.remove("transparentBcg");
};

const updateCartUi = () => {
  let cartItemTotal = 0;
  let cartConten = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.amount * item.price;
    cartItemTotal += item.amount;
    cartConten += `
    <div class="cart-item">
            <img src="${item.image}" alt="product" srcset="" />
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}>+</i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}>-</i>
            </div>
          </div>
    `;
  });
  cartContent.innerHTML = cartConten;
  cartTotal.innerHTML = `$ ${total}`;
  cartItems.innerHTML = cartItemTotal;
};

const showCart = () => {
  cartDom.classList.add("showCart");
  cartOverlay.classList.add("transparentBcg");
};

cartBtn.onclick = () => showCart();
clearCartBtn.onclick = () => {
  let cartdata = cart.map((item) => item.id);
  cartdata.forEach((item) => {
    removeCartItem(item);
    updateCartUi();
  });
};

const removeCartItem = (item) => {
  cart = cart.filter((cartitem) => cartitem.id !== item);
  localStorage.setItem("cart", JSON.stringify(cart));
  const addCartBtns = [...productsDom.querySelectorAll(".bag-btn")];
  const btn = addCartBtns.find((btn) => btn.dataset.id == item);
  btn.disabled = false;
  btn.innerHTML = `<i class="fas fas-shopping-cart"></i>
  add to bag`;
};
const selectClearCartItemBtns = () => {
  cartContent.onclick = (e) => {
    e.preventDefault();
    if (e.target.className == "remove-item") {
      item = e.target.dataset.id;
      removeCartItem(item);
    } else if (e.target.className == "fas fa-chevron-up") {
      item = e.target.dataset.id;
      updateItemAmount(item, 1);
    } else if (e.target.className == "fas fa-chevron-down") {
      item = e.target.dataset.id;
      updateItemAmount(item, -1);
    }
    updateCartUi();
  };
};

const updateItemAmount = (item, value) => {
  cart.forEach((Element) => {
    if (Element.id == item) {
      let neval = Element.amount + value;
      Element.amount = value == -1 && Element.amount == 1 ? 1 : neval;
    }
  });
  localStorage.setItem("cart", JSON.stringify(cart));
};
