const modals = () => {
  let isButtonPressed = false
  function bindModal(triggerSelector, modalSelector, closeSelector, destroy = false) {
    const trigger = document.querySelectorAll(triggerSelector)
    const modal = document.querySelector(modalSelector)
    const close = document.querySelector(closeSelector)
    const windows = document.querySelectorAll("[data-modal]")
    const scroll = calcScroll()

    trigger.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (e.target) {
          e.preventDefault()
        }
        isButtonPressed = true
        if (destroy) {
          item.remove()
        }

        windows.forEach((item) => {
          item.style.display = "none"
          item.classList.add("animated", "fadeIn")
        })

        modal.style.display = "block"
        document.body.style.overflow = "hidden"
        document.body.style.marginRight = `${scroll}px`
      })
    })

    close.addEventListener("click", () => {
      windows.forEach((item) => {
        item.style.display = "none"
      })

      modal.style.display = "none"
      document.body.style.overflow = ""
      document.body.style.marginRight = `0px`
    })

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        windows.forEach((item) => {
          item.style.display = "none"
        })

        modal.style.display = "none"
        document.body.style.overflow = ""
        document.body.style.marginRight = `0px`
      }
    })
  }

  function showModalByTime(selector, time) {
    setTimeout(function () {
      let isDisplaying = false
      document.querySelectorAll("[data-modal]").forEach((item) => {
        if (getComputedStyle(item).display !== "none") {
          isDisplaying = true
        }
      })
      if (!isDisplaying) {
        document.querySelector(selector).style.display = "block"
        document.body.style.overflow = "hidden"
        let scroll = calcScroll()
        document.body.style.marginRight = `${scroll}px`
      }
    }, time)
  }

  function calcScroll() {
    let div = document.createElement("div")

    div.style.width = "50px"
    div.style.height = "50px"
    div.style.overflowY = "scroll"
    div.style.visibility = "hidden"

    document.body.appendChild(div)
    let scrollWidth = div.offsetWidth - div.clientWidth
    div.remove()

    return scrollWidth
  }
  function openByScroll(selector) {
    window.addEventListener("scroll", () => {
      if (
        !isButtonPressed &&
        window.pageYOffset + document.documentElement.clientHeight >=
          document.documentElement.scrollHeight
      ) {
        document.querySelector(selector).click()
      }
    })
  }

  bindModal(".button-design", ".popup-design", ".popup-design .popup-close")
  bindModal(".button-consultation", ".popup-consultation", ".popup-consultation .popup-close")
  bindModal(".fixed-gift", ".popup-gift", ".popup-gift .popup-close", true)
  showModalByTime(".popup-consultation", 60000)
  openByScroll(".fixed-gift")
}

export default modals
