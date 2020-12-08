import { SLIDES_ID } from "../globals"

//show slides, data is [{main, optional, date}]
//property is {interval:boolean, interval:seconds}
//space - pause, arrow left - previous slide, arrow rirht - next slide
function showSlides(data, { isInfinite, interval } = { isInfinite: true, interval: 3 }) {
  let isPause = false
  let currentIndex = 0

  function onKeyKeyDownSlide(e) {
    

    if (e.key === " ") {
      e.preventDefault()
      isPause = !isPause
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault()
      if (currentIndex === 0) return
      currentIndex--
      renderSlide(data[currentIndex])
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      currentIndex++
      //back to first slide
      if (isInfinite && !data[currentIndex]) {
        currentIndex = 0
      }
      renderSlide(data[currentIndex])
    }
  }

  document.addEventListener("keydown", (e) => onKeyKeyDownSlide(e))

  const rootSlides = document.getElementById(SLIDES_ID)

  const slide = document.createElement("div")
  slide.classList.add("slide")
  rootSlides.appendChild(slide)

  const slideContainer = document.createElement("div")
  slideContainer.classList.add("slide__container")
  slide.prepend(slideContainer)

  const slideDate = document.createElement("div")
  slideDate.classList.add("slide__date")
  slideContainer.prepend(slideDate)

  const slideMain = document.createElement("div")
  slideMain.classList.add("slide__main")
  slideContainer.prepend(slideMain)

  const slideOptional = document.createElement("div")
  slideOptional.classList.add("slide__optional")
  slideContainer.prepend(slideOptional)

  const renderSlide = ({ main, date, optional }) => {
    console.log("render index:", currentIndex)
    slideDate.innerText = date ? date.slice(0, 10) : "No date"
    slideOptional.innerText = optional ? optional : ""
    slideMain.innerText = main ? main : "No text"
  }
  //if data empty
  if (data.length === 0) {
    renderSlide({ main: "No slides" })
    return
  }
  renderSlide(data[currentIndex])

  const slideInterval = setInterval(() => {
    if (isPause) return
    currentIndex++

    //back to first slide
    if (isInfinite && !data[currentIndex]) {
      currentIndex = 0
    }

    if (!data[currentIndex]) {
      clearInterval(slideInterval)
      return
    }
    renderSlide(data[currentIndex])
  }, interval * 1000)
  return slideInterval
}

export { showSlides }
