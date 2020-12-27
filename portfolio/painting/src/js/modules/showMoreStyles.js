export default function showMoreStyles(elements, trigger) {
  const elems = document.querySelectorAll(elements)
  const btn = document.querySelector(trigger)

  elems.forEach((el) => {
    el.classList.add("animated", "fadeInUp")
  })

  btn.addEventListener("click", (e) => {
    elems.forEach((el) => {
      el.classList.remove("hidden-lg", "hidden-md", "hidden-sm", "hidden-xs")
      el.classList.add("col-sm-3", "col-sm-offset-0", "col-xs-10", "col-xs-offset-1")
    })
    btn.remove()
  })
}
