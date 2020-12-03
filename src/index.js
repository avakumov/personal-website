import "./styles/main.scss"
import { auth } from "./auth"
import { admin } from "./admin"
import { home } from "./home"
import { animateOnScroll } from "./utils"



auth.init()

//init different page init depending on the path
const path = window.location.pathname.replace(/^\/|\/$/g, "")
if (path === "adm") {
  admin.init()
} else if (path === "") {
  home.init()
}

window.addEventListener("scroll", () => animateOnScroll(100))


