import { api } from "../services/api"
import { toHtml } from "../services/remark"
import { menu } from "./menu"
import hljs from "highlight.js"

function init() {
  menu.init()

  //выполняется запрос постов
  let isFetchingPosts = false
  //постов больше нет, true если последний запрос вернул пустой список
  let noMorePosts = false
  let filter = {}

  //Создание счетчика запросов постов. При каждом вызове увелисивается, возвращает текущее значение
  const getPagePost = createPageCounter()

  //Прослушка скролла на запрос новых постов
  window.addEventListener("scroll", () => {
    if (isFetchPost(300) && !isFetchingPosts && !noMorePosts) {
      isFetchingPosts = true
      api.get("post", { page: getPagePost() }).then((res) => {
        if (res.success) {
          res.data.forEach((post: any) => {
            addPost(post)
          })
          isFetchingPosts = false

          if (res.data.length === 0) {
            noMorePosts = true
          }
        }
      })
    }
  })

  const changeFilter = (f: any) => {
    filter
  }
}

//Функция создание счетчика
function createPageCounter() {
  let pageCount = 1
  return function () {
    return pageCount++
  }
}

//Проверка необходимости запроса постов, delta - длина в пикселях до конца тела страницы
function isFetchPost(delta: number) {
  const lastPost = document.querySelector("#posts")
  const ItemRect = lastPost.getBoundingClientRect()
  const bottomItem = ItemRect.bottom
  const windowHeigth = window.innerHeight
  if (bottomItem - windowHeigth < delta) {
    return true
  }
  return false
}

//add post in DOM
function addPost(post: any) {
  const postDiv = document.createElement("div")
  postDiv.classList.add("page__text-block")
  postDiv.classList.add("_anim_item")

  const titleDiv = document.createElement("div")
  titleDiv.classList.add("page__text-block-title")
  titleDiv.innerText = post.title

  const contentDiv = document.createElement("div")
  contentDiv.classList.add("page__text-block-content")
  contentDiv.innerHTML = toHtml(post.content)

  postDiv.appendChild(titleDiv)
  postDiv.appendChild(contentDiv)

  //обработка выделение кода библиотекой highlight
  postDiv.querySelectorAll("pre code").forEach((block: HTMLElement) => {
    hljs.highlightBlock(block)
  })

  document.getElementById("posts").appendChild(postDiv)
}

export const home = {
  init,
}
