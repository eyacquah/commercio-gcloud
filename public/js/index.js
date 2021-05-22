import regeneratorRuntime from "regenerator-runtime";
import { createStore } from "./storeForm";

const storeForm = document.querySelector(".storeForm");

function handleStoreForm(e) {
  e.preventDefault();
  createStore(this);
}

if (storeForm) storeForm.addEventListener("submit", handleStoreForm);
