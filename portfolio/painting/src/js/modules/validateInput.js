export default function validateInput(selector) {
  const inputs = document.querySelectorAll(selector)
  inputs.forEach((input) => {
    input.addEventListener("keypress", (e) => {
      if (!e.key.match(/[а-яё 1-9]/gi)) {
        e.preventDefault()
      }
    })
    input.addEventListener("input", clearNotValidInpits)
  })

  function clearNotValidInpits() {
    inputs.forEach((input) => {
      if (!input.value.match(/[а-яё1-9]/gi)) {
        input.value = ""
      }
    })
  }
}
