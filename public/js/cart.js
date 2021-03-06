import { renderSpinner } from "./helpers";

const cartQtyEls = document.querySelectorAll(".cartQty");
const cartContainer = document.querySelector(".cartContainer");
const itemContainer = document.querySelector(".itemContainer");
const cartSubtotalEl = document.querySelector(".cartSubtotal");
const myCartSubtotalEl = document.querySelector(".myCartSubtotal");
const cartPageSubtotal = document.querySelector(".cartPageSubtotal");
const itemQtyEl = document.querySelector(".itemQty");
const cartTotalFooter = document.querySelector(".cartTotal");

class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.itemQuantity = 0;
  }

  addToCart(btn) {
    const product = JSON.parse(btn.dataset.product);
    const store = JSON.parse(btn.dataset.store);
    this.itemQuantity++;

    // 1. Check for duplicates
    if (this.checkForDuplicates(product.title)) return;

    // 2. Add to items array or increase quantity
    product.orderQuantity = +itemQtyEl?.value || 1;
    product.storeName = store.storeName;
    product.storeSlug = store.slug;
    this.items.push(product);
    this._calcTotals();
    this.renderCartIcon();
  }

  renderCartIcon() {
    cartContainer.innerHTML = "";
    this.items.forEach((item) => {
      const html = this._createItemHTML(item);
      cartContainer.insertAdjacentHTML("afterbegin", html);
    });

    cartQtyEls.forEach((el) => (el.textContent = this.itemQuantity));
    myCartSubtotalEl.innerHTML = `<small>My Cart</small>$${this.total}`;
    cartSubtotalEl.textContent = `$${this.total.toFixed(2)}`;
    cartTotalFooter.textContent = `$${this.total.toFixed(2)}`;
    this._addListenersRemoveBtns();
    this.saveToLocalStorage();
  }

  renderCartPage() {
    itemContainer.innerHTML = "";
    this.items.forEach((item) => {
      const html = this._createCartPageHTML(item);
      itemContainer.insertAdjacentHTML("afterbegin", html);
    });
    cartPageSubtotal.textContent = `$${this.total.toFixed(2)}`;
    cartTotalFooter.textContent = `$${this.total.toFixed(2)}`;
    this._addListenersRemoveBtns();
    this.saveToLocalStorage();
  }

  updateCart() {
    const cartPageItemEls = document.querySelectorAll(".cartItem");

    renderSpinner("updateCart", "render", "Updating Cart...");
    cartPageItemEls.forEach((el) => {
      // Find the Product
      const itemToUpdate = this.items.find(
        (item) => item.title === el.dataset.title
      );
      itemToUpdate.orderQuantity = +el.value;
    });

    this._calcTotals();
    this.renderCartIcon();
    this.renderCartPage();

    setTimeout(() => renderSpinner("updateCart", "remove"), 2000);
  }

  handleRemoveFromCart(e) {
    const removedItemIdx = this.items.findIndex(
      (item) => item.title === e.target.dataset.title
    );

    this.items.splice(removedItemIdx, 1);

    this._calcTotals();
    this.renderCartIcon();
    if (cartPageSubtotal) this.renderCartPage();
  }

  _addListenersRemoveBtns() {
    const removeBtns = document.querySelectorAll(".removeItem");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", this.handleRemoveFromCart.bind(this));
    });
  }

  _calcTotals() {
    this.total = 0;
    this.itemQuantity = 0;

    this.items.forEach((item) => {
      this.total += item.price * item.orderQuantity;
      this.itemQuantity += item.orderQuantity;
    });

    return this;
  }

  checkForDuplicates(product) {
    if (!this.items.length) return false;

    const duplicate = this.items.find((item) => item.title === product);
    if (duplicate) {
      duplicate.orderQuantity += +itemQtyEl?.value || 1;
    }

    this._calcTotals();
    this.renderCartIcon();
    return duplicate;
  }

  saveToLocalStorage() {
    localStorage.setItem("items", JSON.stringify(this.items));
    localStorage.setItem("total", JSON.stringify(this.total));
    localStorage.setItem("itemQuantity", JSON.stringify(this.itemQuantity));
  }

  init() {
    const items = localStorage.getItem("items");
    const total = localStorage.getItem("total");
    const itemQuantity = localStorage.getItem("itemQuantity");

    if (items) {
      this.items = JSON.parse(items);
      this.total = JSON.parse(total);
      this.itemQuantity = JSON.parse(itemQuantity);
      this.renderCartIcon();
    }

    // localStorage.clear("items");
    // localStorage.clear("total");
    // localStorage.clear("itemQuantity");
  }
  _createItemHTML(product) {
    const html = `<div class="widget-cart-item py-2 border-bottom"><button class="btn-close text-danger" type="button" aria-label="Remove"><span class="removeItem" data-title="${product.title}" aria-hidden="true">&times;</span></button>
    <div class="d-flex align-items-center"><a class="flex-shrink-0" href="/${product.storeSlug}/products/${product.slug}"><img src="${product.images[0]}" width="64" alt="${product.title}" /></a>
        <div class="ps-2">
            <h6 class="widget-product-title"><a href="shop-single-v1.html">${product.title}</a></h6>
            <div class="widget-product-meta"><span class="text-accent me-2">$${product.price}.<small>00</small></span><span class="text-muted">x ${product.orderQuantity}</span></div>
        </div>
    </div>
</div>`;

    return html;
  }

  _createCartPageHTML(product) {
    const html = `<div class="d-sm-flex justify-content-between align-items-center my-2 pb-3 border-bottom">
    <div class="d-block d-sm-flex align-items-center text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto me-sm-4" href="/${product.storeSlug}/products/${product.slug}"><img src="${product.images[0]}" width="160" alt="${product.title}" /></a>
        <div class="pt-2">
            <h3 class="product-title fs-base mb-2"><a href="/${product.storeSlug}/products/${product.slug}">${product.title}</a></h3>
            <div class="fs-sm"><span class="text-muted me-2">Sold by:</span>${product.storeName}</div>
            <div class="fs-lg text-accent pt-2">$${product.price}<small></small></div>
        </div>
    </div>
    <div class="pt-2 pt-sm-0 ps-sm-3 mx-auto mx-sm-0 text-center text-sm-start" style="max-width: 9rem;"><label class="form-label" for="quantity2">Quantity</label><input class="form-control cartItem" data-title="${product.title}" id="quantity2" type="number" min="1" value="${product.orderQuantity}" /><button class="removeItem btn btn-link px-0 text-danger"  data-title="${product.title}" type="button"><i class="ci-close-circle me-2"></i><span class="fs-sm">Remove</span></button></div>
</div>`;

    return html;
  }
}

export const cart = new Cart();
if (cartContainer) {
  cart.init();
}

if (itemContainer) {
  cart.renderCartPage();
}
