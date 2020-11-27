import "./styles/main.scss"
import { auth } from "./auth"
import { admin } from "./admin"
import { home } from "./home"



//auth.init()

//init different page init depending on the path
const path = window.location.pathname.replace(/^\/|\/$/g, '')
if (path === 'adm') {
  admin.init()
} else if ( path === '') {
  home.init()
}


const p = getComputedStyle(document.documentElement).getPropertyValue(
  "--entity"
)


window.addEventListener("scroll", () => animateOnScroll(100))

function animateOnScroll(deltaY) {
  const animItems = document.querySelectorAll("._anim_item")
  animItems.forEach((el, index) => {
    const ItemRect = el.getBoundingClientRect()
    const topItem = ItemRect.top
    const bottomItem = ItemRect.bottom
    const windowHeigth = window.innerHeight

    //bottom animation hidden, appear
    let deltaBottom = windowHeigth - topItem
    if (deltaBottom < deltaY) {
      el.classList.add("_down-hidden")
    } else {
      el.classList.remove("_down-hidden")
    }

    //top animation hidden, appear
    let deltaTop = bottomItem
    if (deltaTop < deltaY) {
      el.classList.add("_up-hidden")
    } else {
      el.classList.remove("_up-hidden")
    }
  })
}
