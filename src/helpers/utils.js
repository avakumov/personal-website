const postData = async (url = "", data = {}) => {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  })
  return res
}

const deleteData = (url = "") => {
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

const putData = async (url = "", data = {}) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data),
  })
  return res
}

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

export { postData, deleteData, animateOnScroll, putData }
