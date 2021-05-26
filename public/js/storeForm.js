import axios from "../../node_modules/axios";
// import { async } from "regenerator-runtime";

export const createStore = async (form) => {
  console.log("Form recieved.");

  const newStore = new FormData();

  newStore.append("storeName", form.name.value.trim());
  newStore.append("description", form.description.value.trim());
  newStore.append("phoneNumber", form.phone.value.trim());
  newStore.append("storeOwner", form.dataset.userid);

  const image = document.querySelector(".file-drop-input")?.files;

  newStore.append("image", image[0]);

  await sendStoreData(newStore);
};

const sendStoreData = async (data) => {
  try {
    const res = await axios.post(`/api/v1/stores`, data);
    // return console.log(res.data);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/${res.data.data.slug}/dashboard`;
    }
  } catch (err) {
    console.error(err);
  }
};
