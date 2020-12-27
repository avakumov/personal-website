import modals from "./modules/modals"
import sliders from "./modules/sliders"
import forms from "./modules/forms"
import mask from "./modules/mask"
import validateInput from "./modules/validateInput"

window.addEventListener("DOMContentLoaded", () => {
  "use strict"
  modals()
  sliders('.feedback-slider-item', 'horizontal', '.main-prev-btn', '.main-next-btn')
  sliders('.main-slider-item', 'vertical')
  forms()
  mask("[name='phone']")
  validateInput("[name='name']")
  validateInput("[name='message']")
})
