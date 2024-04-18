setTimeout(() => {
  const abatorElem = document.querySelector(".js-profile-editable-replace");

  const spanElem = document.createElement("span");
  spanElem.textContent = "Chrome拡張機能が追加";

  abatorElem.appendChild(spanElem);
}, 1000);
