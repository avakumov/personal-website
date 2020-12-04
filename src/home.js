import { api } from "./services/api"
import { toHtml } from "./services/remark"
import { menu } from "./menu"

function init() {
  menu.init()

  //выполняется запрос постов
  let isFetchingPosts = false
  //постов больше нет, true если последний запрос вернул пустой список
  let noMorePosts = false

  //Создание счетчика запросов постов. При каждом вызове увелисивается, возвращает текущее значение
  const getPagePost = createPageCounter()

  //Прослушка скролла на запрос новых постов
  window.addEventListener("scroll", () => {
    if (isFetchPost(300) && !isFetchingPosts && !noMorePosts) {
      isFetchingPosts = true

      api.getPosts(getPagePost()).then((posts) => {
        posts.forEach((post) => {
          addPost(post)
        })
        isFetchingPosts = false

        if (posts.length === 0) {
          noMorePosts = true
        }
      })
    }
  })
}

//Функция создание счетчика
function createPageCounter() {
  let pageCount = 1
  return function () {
    return pageCount++
  }
}

//Проверка необходимости запроса постов, delta - длина в пикселях до конца тела страницы
function isFetchPost(delta) {
  const lastPost = document.getElementById("posts").lastChild
  const ItemRect = lastPost.getBoundingClientRect()
  const bottomItem = ItemRect.bottom
  const windowHeigth = window.innerHeight
  if (bottomItem - windowHeigth < delta) {
    return true
  }
  return false
}

//add post in DOM
function addPost(post) {
  const postDiv = document.createElement("div")
  postDiv.classList.add("page__text-block")
  postDiv.classList.add("_anim_item")

  const titleDiv = document.createElement("div")
  titleDiv.classList.add("page__text-block-title")
  titleDiv.innerText = post.title

  const contentDiv = document.createElement("div")
  contentDiv.classList.add("page__text-block-content")
  contentDiv.innerText = toHtml(post.content)

  postDiv.appendChild(titleDiv)
  postDiv.appendChild(contentDiv)

  //обработка выделение кода библиотекой highlight
  postDiv.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightBlock(block)
  })

  document.getElementById("posts").appendChild(postDiv)
}

export const home = {
    init
}