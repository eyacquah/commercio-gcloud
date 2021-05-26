import axios from "../../node_modules/axios";
import { showAlert, renderSpinner } from "./helpers";

export const createProduct = async (form) => {
  console.log("Form recieved.");

  const productForm = new FormData();

  //   const arr = window.location.pathname.split("/");
  //   console.log(arr);

  if (!form.title.value || !form.description.value || !form.price.value) {
    return showAlert(
      "error",
      "You must fill all required fields of this form",
      "productForm"
    );
  }

  productForm.append("title", form.title.value);
  productForm.append("description", form.description.value);
  productForm.append("price", form.price.value);
  productForm.append("store", form.dataset.storeId);

  const images = document.querySelector(".images")?.files;

  if (images.length === 0 || images.length > 3) {
    return showAlert(
      "error",
      "You must upload at least one image or not more than three images",
      "productForm"
    );
  }

  for (let i = 0; i < images.length; i++) {
    productForm.append("images", images[i]);
  }

  return await sendProductData(productForm);
};

const sendProductData = async (data) => {
  try {
    renderSpinner("productBtn", "render", "Uploading...");

    const res = await axios.post("/api/v1/products", data);

    if (res.data.status === "success") {
      const paths = window.location.pathname.split("/");

      window.location.href = `${window.location.origin}/${paths[1]}/dashboard`;
    }
  } catch (err) {
    showAlert("error", "Product not uploaded", "productForm");
    showAlert("error", err.message, "productForm");
    console.error(error);
  }
};
