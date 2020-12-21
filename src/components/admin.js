import { api } from "../services/api"
import { createContext } from "../helpers/hotkeys"
import { ShowSlides } from "./slide"
import { CURRENT_TAG_ID, SLIDES_ID, CLI_ID, TAGS_ID, CONTENT_ID } from "../globals"

//TODO relocate state
const state = {
  tags: [],
  currentTag: "",
  showSlides: null,
  editingNote: null,
  numberEntityRendered: 0,
}

function init() {
  //hotkeys context
  const hotKeyContext = createContext()

  //open and close cli input by hotkey
  hotKeyContext.register("ctrl+j", (e) => {
    e.preventDefault()
    renderCLI()
  })

  //show slide notes by hotkey
  hotKeyContext.register("ctrl+k", (e) => {
    e.preventDefault()
    showSlidesCurrentNotes()
  })

  //show posts by hotkey
  //TODO 1 To restore then refactor content entry point
  // hotKeyContext.register("ctrl+p", (e) => {
  //   e.preventDefault()
  //   showPosts()
  // })

  //add event listener for add note
  const textareaNewNote = document.getElementById("admin-textarea-new-note")
  textareaNewNote.addEventListener("keypress", (e) => onAddNote(e))

  const inputNewTag = document.getElementById(CURRENT_TAG_ID)

  //add event listener for changed input
  inputNewTag.addEventListener("input", onChangeInputTag)

  //add event listener for add tag. Tag added by press Enter.
  inputNewTag.addEventListener("keypress", onKeyPressInputTag)

  renderNotes()

  renderTags()
}
// TODO 2 To restore then refactor content entry point
// function showPosts() {
//   const content = document.getElementById(CONTENT_ID)
//   content.innerHTML = ""
//   const newDiv = document.createElement("div")
//   newDiv.innerText = "hellos"
//   content.appendChild(newDiv)
// }

function showSlidesCurrentNotes() {
  //if slides shows close them
  if (state.showSlides) {
    state.showSlides.stop()
    state.showSlides = null
    return
  }
  let filter = {}
  if (state.currentTag) {
    filter = { tagId: state.currentTag._id }
  }
  api.getEntities("note").then((res) => {
    if (res.success) {
      const notesMappedToSlide = res.data.map((note) => ({
        main: note.name,
        optional: note.tag.name,
        date: note.created_at,
      }))
      state.showSlides = new ShowSlides(SLIDES_ID, notesMappedToSlide)
      state.showSlides.start()
    }
  })
}

function renderTag(tag) {
  const tagOption = document.createElement("option")
  tagOption.innerText = tag.name
  document.getElementById(TAGS_ID).prepend(tagOption)
}

function renderErrorTag(err) {
  const inputTagList = document.getElementById("admin-current-tag")
  inputTagList.value = err
  inputTagList.classList.add("error")
}
//{ _id, name, tag } = entity
function renderEntity(entity, index, isNew = false) {
  //Проверять есть ли такая запись, если есть то вставлять вместо старой
  let { _id, name, tag } = entity
  let entityNode = document.getElementById(_id)

  if (entityNode) {
    const oldIndex = entityNode.getAttribute("number")
    index = oldIndex
  } else {
    state.numberEntityRendered++
    entityNode = document.createElement("div")
    entityNode.classList.add("entities__item")
    entityNode.classList.add("_anim_item")
    //for refer edit, delete
    entityNode.setAttribute("id", _id)
    entityNode.setAttribute("number", index)

    const tagNode = document.createElement("div")
    tagNode.classList.add("entities__item-tag")
    tagNode.innerText = tag.name

    const numberNode = document.createElement("div")
    numberNode.classList.add("entities__item-number")
    numberNode.innerText = index

    const nameNode = document.createElement("div")
    nameNode.classList.add("entities__item-name")
    nameNode.innerText = name

    entityNode.append(tagNode)
    entityNode.append(numberNode)
    entityNode.append(nameNode)
    document.getElementById(CONTENT_ID).prepend(entityNode)
  }

  if (isNew) {
    entityNode.classList.add("blink-add-entity")
  } //blink new note
}

function renderErrorEntities(msg) {
  const err = document.createElement("div")
  err.classList.add("entities__item")
  err.classList.add("_anim_item")
  err.classList.add("error")
  err.innerText = msg
  document.getElementById(CONTENT_ID).appendChild(err)
}

function renderMsg(message) {
  const msg = document.createElement("div")
  msg.classList.add("entities__item")
  msg.classList.add("_anim_item")
  msg.innerText = message
  document.getElementById(CONTENT_ID).appendChild(msg)
}

//add note by pressing Enter
function onAddNote(e) {
  if (e.key === "Enter") {
    const noteTextarea = document.getElementById("admin-textarea-new-note") //TODO refactor name id
    const noteText = noteTextarea.value
    const tagId = state.currentTag._id

    noteTextarea.classList.remove("blink-error")
    e.preventDefault()
    if (state.editingNote) {
      state.editingNote.name = noteText
      state.editingNote.tag = tagId
      api
        .putNote(state.editingNote)
        .then((res) => {
          if (res.success) {
            renderEntity(res.data, state.numberEntityRendered, true)
            noteTextarea.value = ""
            state.editingNote = null
          }
        })
        .catch((err) => {
          console.log(err)
        })

      return
    }

    if (tagId && noteText) {
      const newNote = { tag: tagId, name: noteText }
      api
        .postNote(newNote)
        .then((res) => {
          if (res.success) {
            //render new note then go back from api
            renderEntity(res.data, state.numberEntityRendered, true)
            noteTextarea.value = ""
          } else {
            // blink border error input if note not saved
            noteTextarea.classList.add("blink-error")
          }
        })
        .catch((err) => {
          console.log(err) //TODO show message
        })
    }
  }
}

function onKeyPressInputTag(e) {
  const newTag = document.getElementById(CURRENT_TAG_ID)

  //clear blink classes
  newTag.classList.remove("blink-ok")
  newTag.classList.remove("blink-error")

  if (e.key === "Enter") {
    e.preventDefault()
    api
      .postTag(newTag.value)
      .then((res) => {
        if (res.success) {
          state.tags.push(res.data)
          state.currentTag = res.data
          renderTag(res.data)

          //blink on success
          newTag.classList.add("blink-ok")
        } else {
          //blink error
          newTag.classList.add("blink-error")
        }
      })
      .catch((err) => {
        //blink on error
        newTag.classList.add("blink-error")
        console.log("ERROR: ", err)
      })
  }
}

function onChangeInputTag() {
  const tagName = document.getElementById(CURRENT_TAG_ID).value

  //rerender all notes
  if (tagName.length === 0) {
    return rerenderNotes()
  }

  //add tag to state.current if exist in the database
  const tag = getTagByName(tagName)
  state.currentTag = tag
  //rerender notes by filter tag
  if (tag) {
    return rerenderNotes({ tag: tag._id })
  }
  rerenderNotes({ tag: "nothing" })
}

function getTagByName(name) {
  let [tag] = state.tags.filter((tag) => tag.name === name)
  return tag
}

//filter object {tagId: value}
//get notes and render them or render error
function renderNotes(filter) {
  api
    .getEntities("note", filter)
    .then((res) => {
      //reset numbers notes
      if (res.success) {
        if (res.data.length === 0) return renderMsg("Записей пока нет")
        state.numberEntityRendered = 0
        res.data.forEach((note, index) => {
          renderEntity(note, index)
        })
      } else {
        renderMsg("Такого тега нет")
      }
    })
    .catch((err) => {
      renderErrorEntities("Нет связи с сервером")
    })
}

//get tags and render them in input list or render error
function renderTags() {
  api
    .getEntities("tag")
    .then((res) => {
      if (res.success) {
        state.tags = res.data
        res.data.forEach((tag) => {
          renderTag(tag)
        })
      }
    })
    .catch((err) => {
      console.log("ERROR: ", err)
      renderErrorTag("Нет связи с сервером")
    })
}

function rerenderNotes(filter) {
  document.getElementById(CONTENT_ID).innerHTML = ""
  renderNotes(filter)
}

function renderCLI() {
  const exist = document.getElementById("input-cli")
  if (exist) {
    exist.remove()
    return
  }
  const rootCLI = document.getElementById(CLI_ID)
  const inputCLI = document.createElement("input")
  inputCLI.type = "text"
  inputCLI.classList.add("page__cli")
  inputCLI.id = "input-cli"

  rootCLI.appendChild(inputCLI)
  inputCLI.focus()
  inputCLI.addEventListener("keypress", onKeyPressInputCLI)
}

//hadler keypress cli
function onKeyPressInputCLI(e) {
  if (e.key !== "Enter") {
    return
  }
  const command = e.target.value
  const [name, value] = command.split(" ")
  if (name === "tag") {
    tagCommand(value)
  } else if (name === "del") {
    delCommand(value)
  } else if (name === "edit") {
    editCommand(value)
  }
  function tagCommand(value) {
    if (!value) {
      //clear input tags and from state
      document.getElementById(CURRENT_TAG_ID).value = ""
      state.currentTag = ""

      //rerender all notes
      return rerenderNotes()
    }

    const tag = getTagByName(value)
    //filter by tag
    if (tag) {
      //insert tagname in input, change current name tag
      document.getElementById(CURRENT_TAG_ID).value = tag.name
      state.currentTag = tag

      rerenderNotes({ tag: tag._id })
    }
  }

  function delCommand(value) {
    const number = Number.parseInt(value)
    if (number >= 0) {
      const el = document.querySelector(`[number="${value}"]`)
      const id = el.getAttribute("id")
      if (id) {
        api
          .deletePost(id)
          .then((res) => {
            console.log(res)
            //remove note from DOM
            el.parentNode.removeChild(el)
          })
          .catch((err) => console.log(err))
      }
    }
  }

  function editCommand(value) {
    const number = Number.parseInt(value)
    if (number) {
      const el = document.querySelector(`[number="${value}"]`)
      const id = el.getAttribute("id")

      if (id) {
        api
          .getEntities("note", { _id: id })
          .then((res) => {
            if (res.success) {
              const [note] = res.data
              if (note) {
                state.editingNote = note
                state.currentTag = note.tag
                document.getElementById("admin-textarea-new-note").value = note.name
                document.getElementById(CURRENT_TAG_ID).value = note.tag.name
              }
            }
          })
          .catch((err) => console.log(err))
      }
    }
  }
}

export const admin = {
  init,
}
