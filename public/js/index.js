import regeneratorRuntime from "../../node_modules/regenerator-runtime";
import { createStore } from "./storeForm";
import { createProduct } from "./productForm";

const storeForm = document.querySelector(".storeForm");
const productForm = document.querySelector(".productForm");

function handleStoreForm(e) {
  e.preventDefault();
  createStore(this);
}

function handleProductForm(e) {
  e.preventDefault();
  createProduct(this);
}

if (storeForm) storeForm.addEventListener("submit", handleStoreForm);
if (productForm) productForm.addEventListener("submit", handleProductForm);
