function init() {
  const menuItems = document.getElementsByClassName("_menu-item")
  const miArr = [...menuItems]
  miArr.forEach(menuItem => {
    menuItem.addEventListener("click", () => handleClickMenuItem(menuItem.getAttribute("id")))
  })
  let html = ""
  let positionY = 0
  function handleClickMenuItem(id) {
    switch (id) {
      case "menu-item-go": {
        html = document.getElementById("posts").innerHTML
        positionY = window.pageYOffset
        document.getElementById("posts").innerHTML = ""
        break
      }
      case "menu-item-posts": {
        document.getElementById("posts").innerHTML = html
        window.pageYOffset = positionY
        break
        
      }
    }
  }
}


export const menu = {
  init,
};
