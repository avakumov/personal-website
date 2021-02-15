let gongInterval = null
let secondInterval = null
const timer = document.querySelector(".timer-gong")

function gongInit() {
  timer.addEventListener("click", interactWithUser)
}

function interactWithUser() {
  run(1800)
}

function run(seconds) {
  if (gongInterval || secondInterval) {
    stop()
  } else {
    resetTimer()
    gongInterval = setInterval(toggle, 1000 * seconds)
    secondInterval = setInterval(updateTime, 1000)
  }
}

function toggle() {
  toggleClasses()
  gong()
  resetTimer()
}
function stop() {
  clearInterval(gongInterval)
  gongInterval = false
  clearInterval(secondInterval)
  secondInterval = false
  document.querySelector(".timer-gong__content").textContent = "start"
}

function resetTimer() {
  document.querySelector(".timer-gong__content").textContent = "00:00"
}

function updateTime() {
  let timer = document.querySelector(".timer-gong__content").textContent
  let [minutes, seconds] = timer.split(":").map((t) => {
    return parseInt(t)
  })
  seconds = parseInt(minutes * 60 + seconds)
  seconds++
  minutes = Math.floor(seconds / 60)
  seconds = seconds % 60
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  if (seconds < 10) {
    seconds = "0" + seconds
  }

  document.querySelector(".timer-gong__content").textContent = `${minutes}:${seconds}`
}

function gong() {
  const audio = document.getElementById("gong")
  audio.play()
  console.log("gong")
}

function toggleClasses() {
  const timer = document.querySelector(".timer-gong")
  if (timer.classList.contains("timer-gong--active")) {
    timer.classList.remove("timer-gong--active")
  } else {
    timer.classList.add("timer-gong--active")
  }
}

export { gongInit }
