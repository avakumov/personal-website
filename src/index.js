import "./styles/main.scss"
import { api } from "./services/api"
import { toHtml } from "./services/remark"
import { auth } from "./auth"

//выполняется запрос постов
let isFetchingPosts = false

//постов больше нет, true если последний запрос вернул пустой список
let noMorePosts = false

auth.init()

//Функция создание счетчика
function createPageCounter() {
  let pageCount = 1
  return function () {
    return pageCount++
  }
}

//Создание счетчика запросов постов. При каждом вызове увелисивается, возвращает текущее значение
const getPagePost = createPageCounter()

const p = getComputedStyle(document.documentElement).getPropertyValue(
  "--entity"
)

api.getEntities().then((entities) => {
  const mapedEntities = entities.map((entity) => {
    return {
      id: entity._id,
      title: entity.name,
    }
  })
  mapedEntities.map((entity) => {
    addElement(entity.title)
  })
  console.log(mapedEntities)
})

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
  titleDiv.innerHTML = post.title

  const contentDiv = document.createElement("div")
  contentDiv.classList.add("page__text-block-content")
  contentDiv.innerHTML = toHtml(post.content)

  postDiv.appendChild(titleDiv)
  postDiv.appendChild(contentDiv)

  //обработка выделение кода библиотекой highlight
  postDiv.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightBlock(block)
  })

  document.getElementById("posts").appendChild(postDiv)
}

window.addEventListener("scroll", () => animateOnScroll(100))

function animateOnScroll(deltaY) {
  const animItems = document.querySelectorAll("._anim_item")

  animItems.forEach((el, index) => {
    const ItemRect = el.getBoundingClientRect()
    const topItem = ItemRect.top
    const bottomItem = ItemRect.bottom
    const windowHeigth = window.innerHeight

    //bottom animation hidden, appear
    let deltaBottom = windowHeigth - topItem
    if (deltaBottom < deltaY) {
      el.classList.add("_down-hidden")
    } else {
      el.classList.remove("_down-hidden")
    }

    //top animation hidden, appear
    let deltaTop = bottomItem
    if (deltaTop < deltaY) {
      el.classList.add("_up-hidden")
    } else {
      el.classList.remove("_up-hidden")
    }
  })
}
