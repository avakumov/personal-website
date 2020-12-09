//show slides, data is [{main, optional, date}]
//property is {interval:boolean, interval:seconds}
//space - pause, arrow left - previous slide, arrow rirht - next slide
class ShowSlides {
  constructor(parentId, data, { isInfinite, interval } = { isInfinite: true, interval: 3 }) {
    this.data = data
    this.isInfinite = isInfinite
    this.interval = interval
    this.isPause = false
    this.currentIndex = 0
    this.parentId = parentId
    this._bindKeyDownListener = this._onKeyKeyDownSlide.bind(this)
  }

  _onKeyKeyDownSlide(e) {
    if (e.key === " ") {
      e.preventDefault()
      this.isPause = !this.isPause
      return
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault()
      if (this.currentIndex === 0) return
      this.currentIndex--
      return this._render(this.data[this.currentIndex])
    }
    if (e.key === "ArrowRight") {
      e.preventDefault()
      this.currentIndex++
      //back to first slide
      if (this.isInfinite && !this.data[this.currentIndex]) {
        this.currentIndex = 0
      }
      return this._render(this.data[this.currentIndex])
    }
  }

  _mount() {
    const rootSlides = document.getElementById(this.parentId)

    const slide = document.createElement("div")
    slide.classList.add("slide")
    rootSlides.appendChild(slide)

    const slideContainer = document.createElement("div")
    slideContainer.classList.add("slide__container")
    slide.prepend(slideContainer)

    this.slideDate = document.createElement("div")
    this.slideDate.classList.add("slide__date")
    slideContainer.prepend(this.slideDate)

    this.slideMain = document.createElement("div")
    this.slideMain.classList.add("slide__main")
    slideContainer.prepend(this.slideMain)

    this.slideOptional = document.createElement("div")
    this.slideOptional.classList.add("slide__optional")
    slideContainer.prepend(this.slideOptional)
  }

  _unmount() {
    const rootSlides = document.getElementById(this.parentId)
    rootSlides.innerHTML = ""
  }

  _render({ main, date, optional }) {
    console.log("render index:", this.currentIndex)
    this.slideDate.innerText = date ? date.slice(0, 10) : "No date"
    this.slideOptional.innerText = optional ? optional : ""
    this.slideMain.innerText = main ? main : "No text"
  }

  start() {
    this._mount()
    if (this.data.length === 0) {
      this._render({ main: "No slides" })
      return
    }
    this._render(this.data[this.currentIndex])
    document.addEventListener("keydown", this._bindKeyDownListener)
    this.slideInterval = setInterval(this._changeSlide.bind(this), this.interval * 1000)
  }

  stop() {
    document.removeEventListener("keydown", this._bindKeyDownListener)
    clearInterval(this.slideInterval)
    this._unmount()
  }

  _changeSlide() {
    if (this.isPause) return
    this.currentIndex++

    //back to first slide
    if (this.isInfinite && !this.data[this.currentIndex]) {
      this.currentIndex = 0
    }

    if (!this.data[this.currentIndex]) {
      return
    }

    this._render(this.data[this.currentIndex])
  }
}

export { ShowSlides }
