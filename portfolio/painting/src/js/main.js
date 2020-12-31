import modals from "./modules/modals"
import sliders from "./modules/sliders"
import forms from "./modules/forms"
import mask from "./modules/mask"
import validateInput from "./modules/validateInput"
import showMoreStyles from "./modules/showMoreStyles"
import calc from "./modules/calc"
import filter from "./modules/filter"
import pictureSize from "./modules/pictureSize"
import collapse from "./modules/collapse"
import burger from "./modules/burger"
import scrolling from "./modules/scrolling"

window.addEventListener("DOMContentLoaded", () => {
  "use strict"
  modals()
  sliders(".feedback-slider-item", "horizontal", ".main-prev-btn", ".main-next-btn")
  sliders(".main-slider-item", "vertical")
  forms()
  mask("[name='phone']")
  validateInput("[name='name']")
  validateInput("[name='message']")
  showMoreStyles(".styles-2", ".button-styles")
  calc("#size", "#material", "#options", ".promocode", ".calc-price")
  filter()
  pictureSize(".sizes-block")
  collapse(".accordion-heading")
  burger(".burger-menu", ".burger")
  scrolling(".pageup")
})
