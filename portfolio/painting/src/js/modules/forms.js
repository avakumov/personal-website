const forms = () => {
  const form = document.querySelectorAll("form")
  const inputs = document.querySelectorAll("input")
  const upload = document.querySelectorAll('[name="upload"]')

  const message = {
    loading: "Downloading...",
    success: "Thanks! We will contact you soon",
    failure: "Something went wrong ...",
    spinner: "assets/img/spinner.gif",
    ok: "assets/img/ok.png",
    fail: "assets/img/fail.png",
  }

  const path = {
    design: "assets/server.php",
    question: "assets/quesion.php",
  }

  const postData = async (url, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url === path.design || url === path.question) {
          resolve(data)
        } else {
          reject(data)
        }
      }, 1000)
    })
  }

  const clearInputs = () => {
    inputs.forEach((item) => {
      item.value = ""
    })
    upload.forEach((item) => {
      item.previousElementSibling.textContent = "Загрузить фотографию"
    })
  }
  upload.forEach((item) => {
    item.addEventListener("input", () => {
      let dots
      const filename = item.files[0].name.split(".")[0]
      const extention = item.files[0].name.split(".")[1]
      filename.length > 5 ? (dots = "...") : (dots = ".")
      const name = filename.substring(0, 6) + dots + extention
      item.previousElementSibling.textContent = name
    })
  })

  form.forEach((item) => {
    item.addEventListener("submit", (e) => {
      e.preventDefault()

      let statusMessage = document.createElement("div")
      statusMessage.classList.add("status")
      item.parentNode.appendChild(statusMessage)
      item.classList.add("animated", "fadeOutUp")
      setTimeout(() => {
        item.style.display = "none"
      }, 400)
      let statusImg = document.createElement("img")
      statusImg.setAttribute("src", message.spinner)
      statusImg.classList.add("animated", "fadeInUp")
      statusMessage.appendChild(statusImg)

      let textMessage = document.createElement("div")
      textMessage.textContent = message.loading
      statusMessage.appendChild(textMessage)

      const formData = new FormData(item)
      let api
      item.closest(".popup-design") || item.classList.contains("calc_form")
        ? (api = path.design)
        : (api = path.question)

      postData(api, formData)
        .then((res) => {
          for (var p of res.entries()) {
            console.log(p)
          }
          statusImg.setAttribute("src", message.ok)
          textMessage.textContent = message.success
        })
        .catch(() => {
          statusImg.setAttribute("src", message.fail)
          textMessage.textContent = message.failure
        })
        .finally(() => {
          clearInputs()
          setTimeout(() => {
            statusMessage.remove()
            item.style.display = "block"
            item.classList.remove("fadeOutUp")
            item.classList.remove("fadeInUp")
          }, 5000)
        })
    })
  })
}

export default forms
