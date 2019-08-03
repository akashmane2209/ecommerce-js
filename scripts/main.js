/*Importing Products*/
const cartBtn = document.getElementById("cart-icon");
const closeCartBtn = document.getElementById("close-cart");
const clearCartBtn = document.getElementById("clear-cart");
const cartDiv = document.getElementById("cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartContent = document.getElementById("cart-content");
const productsDiv = document.getElementById("products");
const checkoutContent = document.getElementById("checkout-content");
const checkoutBtn = document.getElementById("checkout");
const checkoutModal = document.getElementById("checkout-modal");
const closeCheckout = document.getElementById("close-checkout");
const checkoutTotal = document.getElementById("checkout-total");

const loginModal = document.getElementById("login-modal");
const loginBtn = document.getElementById("login-register");
const loginClose = document.getElementById("login-close");

const navBtn = document.getElementById("login-register");
const navSpan = document.getElementById("nav-span");

const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");

// cart
let inCart = [];

let atcBtns = [];

let totalAmount = 0;
let tempTotal = 0;

class Products {
  async getProducts() {
    let result;
    await fetch("products.json").then(function(response) {
      result = response.json();
    });
    return result;
  }

  displayProducts(products) {
    let res = "";
    products.forEach(function(product) {
      res += `
      <article class="single-product">
      <div class="img-box">
        <img
          src=${product.url}
          alt="product 1"
          class="product-image"
        />
        <div class="description">
          <p>
            <b>Description</b><br />
            <b id="brand">Brand:</b>${product.brand}<br />
            <b id="material">Material:</b> ${product.material}<br />
            <b id="size">Size:</b>${product.size}<br />
          </p>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="price">Rs.${product.price}/-</p>
      </div>
      <button class="atc" data-id=${product.id}>
        <span><i class="fa fa-shopping-cart" aria-hidden="true"></i></span>
        Add to Cart
      </button>
      <hr />
    </article>
      `;
    });
    productsDiv.innerHTML = res;
  }
}

class Cart {
  getCartBtn() {
    const $this = this;
    const btns = [...document.getElementsByClassName("atc")];
    atcBtns = btns;
    btns.forEach(btn => {
      let btnID = parseInt(btn.dataset.id);
      let inside = "";
      inside = inCart.find(function(item) {
        return item.id === btnID;
      });
      // console.log(inside);
      if (inside) {
        btn.innerText = "In Cart";
        btn.classList.add("in-cart");
        btn.disabled = true;
      }

      btn.addEventListener("click", function(event) {
        let userLog = Storage.getLoginUser();
        if (userLog != "") {
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          btn.classList.add("in-cart");

          let cartItem = { ...Storage.getProduct(btnID), quantity: 1 };
          inCart = [...inCart, cartItem];
          Storage.saveCart(inCart);
          $this.setInCartValues(inCart);
          $this.addCartItem(cartItem);
          $this.showCart();
        } else {
          alert("Login to add items to cart");
        }
      });
    });
  }

  setInCartValues(cart) {
    tempTotal = 0;
    let totalQuantity = 0;
    let productPrice = 0;
    cart.map(product => {
      productPrice = product.price;
      totalQuantity += product.quantity;
      tempTotal += product.price * product.quantity;
    });
    cartTotal.innerText = tempTotal;
    cartItems.innerText = totalQuantity;
    checkoutTotal.innerHTML = `<h4>Total: ${tempTotal}/-</h4>`;
  }

  addCartItem(cart) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    
    <img src=${cart.url} alt="product-image" />
              <div>
                <h4>${cart.name}</h4>
                <h5>Rs.${cart.price}/-</h5>
                <span class="remove-item" data-id=${cart.id}>remove</span>
              </div>
              <div>
                <i class="fa fa-chevron-up arrow-up" data-id=${cart.id}></i>
                <p class="total-quantity">${cart.quantity}</p>
                <i class="fa fa-chevron-down arrow-down" data-id=${cart.id}></i>
              </div>
    
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cart.classList.add("showCart");
    overlay.classList.add("showOverlay");
  }

  hideCart() {
    cart.classList.remove("showCart");
    overlay.classList.remove("showOverlay");
  }
  setup() {
    const $this = this;
    inCart = Storage.getCart();
    console.log(inCart);
    //$this.getCartBtn();
    $this.setInCartValues(inCart);
    inCart.forEach(cartItem => {
      $this.addCartItem(cartItem);
    });
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    closeCartBtn.addEventListener("click", () => {
      this.hideCart();
    });
    cartContent.addEventListener("click", event => {
      console.log(event.target);
      if (event.target.classList.contains("remove-item")) {
        let remove = event.target;
        let id = remove.dataset.id;
        console.log("remove", id);
        console.log(remove.parentElement.parentElement);
        cartContent.removeChild(remove.parentElement.parentElement);
        this.removeProduct(id);
        console.log(inCart);
        if (inCart.length > 0) {
          this.hideCart();
        }
      } else if (event.target.classList.contains("fa-chevron-up")) {
        console.log("up");
        let up = event.target;
        let id = up.dataset.id;
        let temp = inCart.find(product => product.id == id);
        temp.quantity = temp.quantity + 1;
        Storage.saveCart(inCart);
        this.setInCartValues(inCart);
        up.nextElementSibling.innerText = temp.quantity;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        console.log("up");
        let up = event.target;
        let id = up.dataset.id;
        let temp = inCart.find(product => product.id == id);
        temp.quantity = temp.quantity - 1;
        Storage.saveCart(inCart);
        this.setInCartValues(inCart);
        up.previousElementSibling.innerText = temp.quantity;
        if (temp.quantity == 0) {
          let remove = event.target;
          let id = remove.dataset.id;
          console.log("remove", id);
          console.log(remove.parentElement.parentElement);
          cartContent.removeChild(remove.parentElement.parentElement);
          this.removeProduct(id);
          console.log(inCart);
        }
      }
    });
  }

  clearCart() {
    let cartItems = inCart.map(products => products.id);
    cartItems.forEach(id => this.removeProduct(id));
    this.hideCart();
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }

  removeProduct(id) {
    console.log(id);
    inCart = inCart.filter(function(product) {
      console.log(product.id, id);
      console.log(product.id != id);
      return product.id != id;
    });
    console.log(cart);
    this.setInCartValues(inCart);
    Storage.saveCart(inCart);

    let button = this.singleButton(id);

    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart" aria-hidden="true"></i></span>
    Add to Cart`;
    button.classList.remove("in-cart");
    console.log(button);
    this.hideCart();
  }

  singleButton(pid) {
    return atcBtns.find(buttons => buttons.dataset.id == pid);
  }
}

class Storage {
  static saveProducts(products) {
    let lsproducts = products.map(product => {
      const id = product.id;
      const name = product.name;
      const price = product.price;
      const url = product.url;
      const category = product.category;
      return { id, name, price, url, category };
    });
    localStorage.setItem("products", JSON.stringify(lsproducts));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id == id);
  }
  static saveCart(cart) {
    localStorage.setItem("incart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("incart")
      ? JSON.parse(localStorage.getItem("incart"))
      : [];
  }

  static setLoginUser(user) {
    localStorage.setItem("login", user);
  }
  static getLoginUser(user) {
    return localStorage.getItem("login") ? localStorage.getItem("login") : "";
  }

  static getOrders() {
    return localStorage.getItem("orders")
      ? JSON.parse(localStorage.getItem("orders"))
      : [];
  }

  static getOrderCount() {
    return localStorage.getItem("order-count")
      ? parseInt(localStorage.getItem("order-count"))
      : 0;
  }
}

class Checkout {
  createCheckoutProduct(product) {
    const div = document.createElement("div");
    div.classList.add("checkout-cart-item");
    div.innerHTML = `
    <img src="${product.url}" alt="product-image" />
    <div>
      <h4><b>Product Name :</b>${product.name}</h4>
      <h5 class="total-quantity">Total Quantity = ${product.quantity}</h5>
    </div>
    <div>
      <p class="total-price">${product.quantity * product.price}/-</p>
    </div>
    
    `;
    checkoutContent.appendChild(div);
  }

  clearCheckoutProducts() {
    while (checkoutContent.children.length > 0) {
      checkoutContent.removeChild(checkoutContent.children[0]);
    }
  }
  displayCheckoutProducts() {
    console.log(inCart);

    inCart.forEach(product => {
      console.log(product);
      this.createCheckoutProduct(product);
    });
  }

  checkoutLogic() {
    checkoutBtn.addEventListener("click", () => {
      console.log(Storage.getLoginUser());
      if (Storage.getLoginUser() == "") {
        alert("Login to checkout");
        cart.classList.remove("showCart");
        overlay.classList.remove("showOverlay");
        return;
      }
      checkoutModal.style.display = "block";
      cart.classList.remove("showCart");
      overlay.classList.remove("showOverlay");
      this.displayCheckoutProducts();
    });
    closeCheckout.addEventListener("click", () => {
      checkoutModal.style.display = "none";
      this.clearCheckoutProducts();
    });
  }
}

class Login {
  setup() {
    this.checkLogin();
    navSpan.addEventListener("click", event => {
      if (event.target.classList.contains("logout")) {
        console.log(this);
        this.logout();
      } else {
        console.log(event.target);
        loginModal.style.display = "block";
        this.openLogin();
      }
    });
  }

  openLogin() {
    console.log("openLOgin");
    let container = document.getElementById("login-container");
    loginClose.onclick = function() {
      loginModal.style.display = "none";
    };

    signUpButton.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInButton.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
    let registerBtn = document.getElementById("register");
    registerBtn.addEventListener("click", event => {
      event.preventDefault();
      this.registerUser();
    });
    let loginButton = document.getElementById("login");
    loginButton.addEventListener("click", event => {
      event.preventDefault();
      console.log("Register1");
      this.loginUser();
    });
  }

  checkLogin() {
    let loggedUser = Storage.getLoginUser();
    console.log("Register2");
    console.log("users" + loggedUser);
    if (loggedUser != "") {
      navSpan.innerHTML = `<p class="btn logout" id="logout">Welcome, ${loggedUser}</p>`;
    } else {
      navSpan.innerHTML = `<button class="round-btn" id="login-register">
      Login / Register
    </button>`;
    }
  }

  logout() {
    localStorage.removeItem("incart");
    localStorage.removeItem("login");
    console.log("Register3");
    navSpan.innerHTML = `<button class="round-btn" id="login-register">
      Login / Register
    </button>`;
    document.location.reload(true);
  }

  registerUser() {
    const container = document.getElementById("login-container");
    const registerEmail = document.getElementById("register-email").value;
    const registerPass = document.getElementById("register-password").value;
    const registerName = document.getElementById("name").value;
    let users = localStorage.getItem("users");
    if (registerEmail == "" || registerPass == "" || registerName == "") {
      alert("Enter complete details");
      return;
    }
    if (users != null) {
      let userArr = users.split(",");
      console.log(userArr);
      if (userArr.indexOf(registerEmail) > -1) {
        alert("User already exists");
        registerEmail = "";
        registerName = "";
        registerPass = "";
      } else {
        users += [, registerEmail, registerPass, registerName];
        console.log(users);
        container.classList.remove("right-panel-active");
        localStorage.setItem("users", users);
        alert("Account created successfully!");
        registerEmail = "";
        registerName = "";
        registerPass = "";
      }
    } else {
      localStorage.setItem("users", [
        registerEmail,
        registerPass,
        registerName
      ]);
      container.classList.remove("right-panel-active");
      alert("Account created successfully!");
      registerEmail = "";
      registerName = "";
      registerPass = "";
    }
  }

  loginUser() {
    console.log("Register4");
    const container = document.getElementById("login-container");
    const loginEmail = document.getElementById("login-email").value;
    const loginPass = document.getElementById("login-password").value;
    let users = localStorage.getItem("users");
    if (loginEmail == "" || loginPass == "") {
      alert("Enter complete details");
      return;
    }
    if (users != null) {
      let userArr = users.split(",");
      console.log(userArr);
      if (userArr.indexOf(loginEmail) == -1) {
        alert("Create an account first!");
        container.classList.add("right-panel-active");
        loginEmail = "";
        loginPass = "";
        return;
      } else {
        let passIndex = userArr.indexOf(loginEmail) + 1;
        let pass = userArr[passIndex];
        console.log(pass);
        if (pass == loginPass) {
          alert("Logged in successfully");
          navSpan.innerHTML = `<p class="btn logout" id="logout">Welcome, ${
            userArr[passIndex + 1]
          }</p>`;
          loginModal.style.display = "none";
          Storage.setLoginUser(userArr[passIndex + 1]);
          loginEmail = "";
          loginPass = "";
        } else {
          alert("Invalid Password!");
          loginEmail = "";
          loginPass = "";
          return;
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const cartObj = new Cart();
  cartObj.setup();
  const checkoutObj = new Checkout();
  const productsObj = new Products();
  const loginObj = new Login();
  loginObj.setup();
  productsObj
    .getProducts()
    .then(products => {
      productsObj.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(function() {
      cartObj.getCartBtn();
      cartObj.cartLogic();
    })
    .then(function() {
      checkoutObj.checkoutLogic();
    });
});

/* Login Modal JS*/

/*End of Login Modal*/

/*Card Slide In*/

var cartIcon = document.getElementsByClassName("cart-icon")[0];
var cartClose = document.getElementsByClassName("cart-close")[0];
var cart = document.getElementsByClassName("cart")[0];
var overlay = document.getElementsByClassName("cart-overlay")[0];

cartIcon.addEventListener("click", () => {
  cart.classList.add("showCart");
  overlay.classList.add("showOverlay");
});

cartClose.addEventListener("click", () => {
  cart.classList.remove("showCart");
  overlay.classList.remove("showOverlay");
});

/*category filter*/
var categoryAll = document.getElementById("all");
var categoryShoes = document.getElementById("shoes");
var categoryBoots = document.getElementById("boots");
var categorySneakers = document.getElementById("sneakers");
var categoryLoafers = document.getElementById("loafers");
var catProduct = new Products();
var catTitle = document.getElementsByClassName("category-title")[0];
var categoryBtnActive = document.getElementsByClassName("active")[0];
let productsFilter = JSON.parse(localStorage.getItem("products"));
categoryAll.addEventListener("click", () => {
  categoryAll.classList.add("active");
  categoryShoes.classList.remove("active");
  categoryBoots.classList.remove("active");
  categorySneakers.classList.remove("active");
  categoryLoafers.classList.remove("active");
  catProduct.displayProducts(productsFilter);
  catTitle.innerHTML = `<h1>All Products</h1>`;
});

categoryShoes.addEventListener("click", () => {
  categoryAll.classList.remove("active");
  categoryShoes.classList.add("active");
  categoryBoots.classList.remove("active");
  categorySneakers.classList.remove("active");
  categoryLoafers.classList.remove("active");
  productsFilter = productsFilter.filter(
    product => product.category == "Shoes"
  );
  //Storage.saveProducts(productsFilter);
  catProduct.displayProducts(productsFilter);
  productsFilter = JSON.parse(localStorage.getItem("products"));
  catTitle.innerHTML = `<h1>Shoes</h1>`;
});

categoryBoots.addEventListener("click", () => {
  categoryAll.classList.remove("active");
  categoryShoes.classList.remove("active");
  categoryBoots.classList.add("active");
  categorySneakers.classList.remove("active");
  categoryLoafers.classList.remove("active");
  productsFilter = productsFilter.filter(
    product => product.category == "Boots"
  );
  //Storage.saveProducts(productsFilter);
  catProduct.displayProducts(productsFilter);
  productsFilter = JSON.parse(localStorage.getItem("products"));
  catTitle.innerHTML = `<h1>Boots</h1>`;
});

categorySneakers.addEventListener("click", () => {
  categoryAll.classList.remove("active");
  categoryShoes.classList.remove("active");
  categoryBoots.classList.remove("active");
  categorySneakers.classList.add("active");
  categoryLoafers.classList.remove("active");
  productsFilter = productsFilter.filter(
    product => product.category == "Sneakers"
  );
  //Storage.saveProducts(productsFilter);
  catProduct.displayProducts(productsFilter);
  productsFilter = JSON.parse(localStorage.getItem("products"));
  catTitle.innerHTML = `<h1>Sneakers</h1>`;
});

categoryLoafers.addEventListener("click", () => {
  categoryAll.classList.remove("active");
  categoryShoes.classList.remove("active");
  categoryBoots.classList.remove("active");
  categorySneakers.classList.remove("active");
  categoryLoafers.classList.add("active");
  productsFilter = productsFilter.filter(
    product => product.category == "Loafers"
  );
  //Storage.saveProducts(productsFilter);
  catProduct.displayProducts(productsFilter);
  productsFilter = JSON.parse(localStorage.getItem("products"));
  catTitle.innerHTML = `<h1>Loafers</h1>`;
});

/*end of category filter*/

/*thankyou modal*/

var thankyoumodal = document.getElementById("thankyou-modal");
var finish = document.getElementById("finish");
var closethank = document.getElementById("close-thankyou");

finish.onclick = function() {
  let orders = Storage.getOrders();
  orderID = 0;
  console.log(orders);
  if (Storage.getOrderCount == 0) {
    orderID = 0;
  } else {
    orderID = Storage.getOrderCount + 1;
  }
  orders = [
    ...orders,
    [orderID, JSON.stringify(inCart), Storage.getLoginUser()]
  ];
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("incart");

  thankyoumodal.style.display = "block";
};

closethank.onclick = function() {
  document.location.reload(true);
  thankyoumodal.style.display = "none";
  checkoutModal.style.display = "none";
};

window.onclick = function(event) {
  if (event.target == thankyoumodal) {
    thankyoumodal.style.display = "none";
  }
};
