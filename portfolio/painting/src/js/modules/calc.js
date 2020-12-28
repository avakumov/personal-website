export default function calc(size, material, options, promocode, result) {
  const sizeBlock = document.querySelector(size)
  const materialBlock = document.querySelector(material)
  const promocodeBlock = document.querySelector(promocode)
  const optionsBlock = document.querySelector(options)
  const resultBlock = document.querySelector(result)

  let sum = 0

  const reCalc = () => {
    sum = Math.round(
      Number(sizeBlock.value) * Number(materialBlock.value) + Number(optionsBlock.value)
    )
    if (sizeBlock.value == "" || materialBlock.value == "") {
      resultBlock.textContent = "Выберете размер и материал картины"
    } else if (promocodeBlock.value === "IWANTPOPART") {
      resultBlock.textContent = Math.round(sum * 0.7) + " RUB"
    } else {
      resultBlock.textContent = sum + " RUB"
    }
  }
  sizeBlock.addEventListener("change", reCalc)
  materialBlock.addEventListener("change", reCalc)
  optionsBlock.addEventListener("change", reCalc)
  promocodeBlock.addEventListener("input", reCalc)
}
