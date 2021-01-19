function init() {
  const el = document.getElementById("auth-btn")
  el ? el.addEventListener("click", loginPopupOpen) : ""

  const closeButton = document.getElementById("login-popup-close")
  closeButton ? closeButton.addEventListener("click", loginPopupClose) : ""

  const loginButton = document.getElementById("login-request")
  loginButton ? loginButton.addEventListener("click", loginRequest) : ""
}

const loginPopupOpen = () => {
  const modal = document.getElementById("login-popup")
  modal ? (modal.style.display = "block") : ""
}

const loginPopupClose = () => {
  const modalEl = document.getElementById("login-popup")
  modalEl ? (modalEl.style.display = "none") : ""
}

const loginRequest = () => {
  // const email = document.getElementById("login-email").value
  // const password = document.getElementById("login-password").value
  // const data = {
  //   identifier: email,
  //   password: password,
  // }
}

export const auth = {
  init,
}
