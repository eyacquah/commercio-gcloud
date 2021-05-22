import axios from "axios";

export const createStore = (form) => {
  console.log("Form recieved.");

  const newStore = new FormData();

  newStore.append("storeName", form.name.value.trim());
  newStore.append("description", form.description.value.trim());
  newStore.append("phoneNumber", form.phone.value.trim());
  newStore.append("storeOwner", form.dataset.userid);

  const image = document.querySelector(".file-drop-input")?.files;

  console.log(image);
};

const sendStoreData = async (data) => {
  try {
    const res = await axios.post(`/api/v1/stores`, data);

    if (res.data.status === "success") {
      window.location.href = `${window.location.origin}/${res.data.data.slug}/dashboard`;
    }
  } catch (err) {
    console.error(err);
  }
};
