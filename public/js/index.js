import regeneratorRuntime from "../../node_modules/regenerator-runtime";
import { createStore } from "./storeForm";
import { createProduct } from "./productForm";
import { cart } from "./cart";

const storeForm = document.querySelector(".storeForm");
const productForm = document.querySelector(".productForm");
const addToCartBtns = document.querySelectorAll(".addToCart");

function handleStoreForm(e) {
  e.preventDefault();
  createStore(this);
}

function handleProductForm(e) {
  e.preventDefault();
  createProduct(this);
}

function handleAddToCart(e) {
  e.preventDefault();
  cart.addToCart(this);
}

if (storeForm) storeForm.addEventListener("submit", handleStoreForm);
if (productForm) productForm.addEventListener("submit", handleProductForm);
if (addToCartBtns) {
  addToCartBtns.forEach((btn) =>
    btn.addEventListener("click", handleAddToCart)
  );
}
