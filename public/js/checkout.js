// import Paystack from "paystack";
import { cart } from "./cart";
import { showAlert } from "./helpers";
const productContainer = document.querySelector(".productContainer");
const orderTotalEl = document.querySelector(".orderTotal");
const orderSubtotalEl = document.querySelector(".orderSubtotal");
const finalOrderItemContainer = document.querySelector(
  ".productContainerSummary"
);
let count = Math.random() * 100;

const paystackPublic = "pk_test_9f328d76a6430333ed4c80826620ec2120e0dc69";

class Order {
  constructor() {
    this.subTotal = 0;
    this.shippingFee = 0;
    this.total = this.subTotal + this.shippingFee;
  }

  renderOrderSummary() {
    showAlert(
      "success",
      "Simply ignore the form. It'll still work",
      "insertAlert"
    );

    cart.items.forEach((item) => {
      const html = this._createItemHTML(item);
      productContainer.insertAdjacentHTML("afterbegin", html);
    });

    this._calcTotals();
    orderSubtotalEl.textContent = `$${this.subTotal.toFixed(2)}`;
    orderTotalEl.textContent = `$${this.total.toFixed(2)}`;
  }

  renderFinalOrderInfo() {
    cart.items.forEach((item) => {
      const html = this._createItemHTMLFinal(item);
      finalOrderItemContainer.insertAdjacentHTML("afterend", html);
    });
    this._calcTotals();
    orderSubtotalEl.textContent = `$${this.subTotal.toFixed(2)}`;
    orderTotalEl.textContent = `$${this.total.toFixed(2)}`;
  }

  _calcTotals() {
    this.subTotal = cart.total;
    this.total = this.subTotal + this.shippingFee;
  }

  _paymentComplete() {
    cart.items = [];
    cart.total = 0;
    cart.itemQuantity = 0;
    cart.renderCartIcon();
    window.location.href = `${window.location.origin}/order/complete`;
  }

  _paymentCancelled() {
    window.location.href = `${window.location.origin}/order-summary`;
  }

  payWithPaystack() {
    const email = "eyacquah0@gmail.com";
    const ref = `customer-${email.split("@")[0]}-${count}`;
    count++;

    console.log(this);
    const handler = PaystackPop.setup({
      key: paystackPublic,
      email: email,
      amount: cart.total * 100 * 6,
      currency: "GHS",
      ref: ref,
      metadata: cart,
      callback: this._paymentComplete,
      onClose: this._paymentCancelled,
    });

    handler.openIframe();
  }

  _createItemHTMLFinal(product) {
    const html = `<div class="d-sm-flex justify-content-between my-4 pb-3 border-bottom">
    <div class="d-sm-flex text-center text-sm-start"><a class="d-inline-block flex-shrink-0 mx-auto me-sm-4" href=/${
      product.storeSlug
    }/products/${product.slug}"><img src="${
      product.images[0]
    }" width="160" alt="${product.title}" /></a>
        <div class="pt-2">
            <h3 class="product-title fs-base mb-2"><a href="/${
              product.storeSlug
            }/products/${product.slug}">${product.title}</a></h3>
            <div class="fs-sm"><span class="text-muted me-2">Sold By:</span>${
              product.storeName
            }</div>
            <div class="fs-lg text-accent pt-2">$${product.price.toFixed(
              0
            )}<small></small></div>
        </div>
    </div>
    <div class="pt-2 pt-sm-0 ps-sm-3 mx-auto mx-sm-0 text-center text-sm-end" style="max-width: 9rem;">
        <p class="mb-0"><span class="text-muted fs-sm">Quantity:</span><span>&nbsp;${
          product.orderQuantity
        }</span></p><a class="btn btn-link px-0" type="button" href="/cart"><i class="ci-edit me-2"></i><span class="fs-sm">Edit</span></a>
    </div>
</div>`;

    return html;
  }

  _createItemHTML(product) {
    const html = `<div class="d-flex align-items-center py-2 border-bottom"><a class="d-block flex-shrink-0" href="/${
      product.storeSlug
    }/products/${product.slug}"><img src="${
      product.images[0]
    }" width="64" alt="${product.title}" /></a>
    <div class="ps-2">
        <h6 class="widget-product-title"><a href="/${
          product.storeSlug
        }/products/${product.slug}">${product.title}</a></h6>
        <div class="widget-product-meta"><span class="text-accent me-2">${product.price.toFixed(
          2
        )}<small></small></span><span class="text-muted">x ${
      product.orderQuantity
    }</span></div>
    </div>
</div>`;
    return html;
  }
}

export const order = new Order();

if (finalOrderItemContainer) {
  order.renderFinalOrderInfo();
}
