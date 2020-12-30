const sliders = (slides, direction, prev, next) => {
  let slideIndex = 1
  let interval = false
  const items = document.querySelectorAll(slides)

  function showSlides(n) {
    if (n > items.length) {
      slideIndex = 1
    }
    if (n < 1) {
      slideIndex = items.length
    }
    items.forEach((item) => {
      item.classList.add("animated")
      item.style.display = "none"
    })

    items[slideIndex - 1].style.display = "block"
  }

  showSlides(slideIndex)

  function plusSlides(n) {
    showSlides((slideIndex += n))
  }
  try {
    const prevBtn = document.querySelector(prev)
    const nextBtn = document.querySelector(next)
    prevBtn.addEventListener("click", () => {
      plusSlides(-1)
      items[slideIndex - 1].classList.remove("slideInLeft")
      items[slideIndex - 1].classList.add("slideInRight")
    })
    nextBtn.addEventListener("click", () => {
      plusSlides(1)
      items[slideIndex - 1].classList.remove("slideInRight")
      items[slideIndex - 1].classList.add("slideInLeft")
    })
  } catch (err) {}

  function activateAnimation() {
    if (direction === "vertical") {
      interval = setInterval(function () {
        plusSlides(1)
        items[slideIndex - 1].classList.add("slideInDown")
      }, 3000)
    } else {
      interval = setInterval(function () {
        plusSlides(1)
        items[slideIndex - 1].classList.remove("slideInRight")
        items[slideIndex - 1].classList.add("slideInLeft")
      }, 3000)
    }
    items[0].parentNode.addEventListener("mouseenter", () => {
      clearInterval(interval)
    })
    items[0].parentNode.addEventListener("mouseleave", () => {
      clearInterval(interval)
      activateAnimation()
    })
  }
  activateAnimation()
}

export default sliders
