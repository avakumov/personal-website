import { SLIDES_ID } from '../globals'

//show slides, data is [{main, optional, date}]
//property is {interval:boolean, interval:seconds}
//TODO realize infinite
function showSlides(data, { isInfinite, interval } = { isInfinite: true, interval: 3 }) {
    let isPause = false
    let currentIndex = 0
  
    // document.addEventListener("keypress", onKeyPressSlide)
  
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
  
    
    const renderSlide = ({main, date, optional}) => {
      slideDate.innerText = date?date.slice(0, 10):"No date"
      slideOptional.innerText = optional?optional:""
      slideMain.innerText = main?main:"No text"
    }
    //if data empty
    if (data.length === 0){
      renderSlide({main: "No slides"})
      return
    }
    renderSlide(data[currentIndex])
    currentIndex++
  
    const slideInterval = setInterval(() => {
      
      if (isPause) return
  
      //back to first slide
      if (isInfinite && !data[currentIndex]) {
        currentIndex = 0
      }
  
      if (!data[currentIndex]) {
        clearInterval(slideInterval)
        return
      }
      console.log(currentIndex)
      renderSlide(data[currentIndex])
      currentIndex++
      
    }, interval * 1000)
    return slideInterval
  }



  export {
    showSlides
  }