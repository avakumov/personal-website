import "./styles/main.scss"
import { auth } from "./components/auth"
import { admin } from "./components/admin"
import { home } from "./components/home"
import { animateOnScroll } from "./helpers/utils"



auth.init()

//init different page init depending on the path
const path = window.location.pathname.replace(/^\/|\/$/g, "")
if (path === "adm") {
  admin.init()
} else if (path === "") {
  home.init()
}

window.addEventListener("scroll", () => animateOnScroll(100))


