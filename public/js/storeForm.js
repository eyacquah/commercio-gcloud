export const createStore = (form) => {
  console.log("Form recieved.");

  const newStore = new FormData();

  newStore.append("storeName", form.name.value.trim());
  newStore.append("description", form.description.value.trim());
  newStore.append("phoneNumber", form.phone.value.trim());
  newStore.append("storeOwner", form.dataset.userID);

  console.log(form.dataset.userID);
  console.log(form.dataset);
};
