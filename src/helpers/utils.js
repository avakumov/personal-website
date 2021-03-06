function animateOnScroll(deltaY) {
  const animItems = document.querySelectorAll("._anim_item")
  animItems.forEach((el) => {
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

export { animateOnScroll }
