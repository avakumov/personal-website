import { api } from "./services/api"
import { createContext } from "./hotkeys"

//classes
const CURRENT_TAG_ID = "admin-current-tag"
const NOTES_ID = "admin-notes"

//TODO relocate state
const state = {
  tags: [],
  currentTag: "",
  showSlides: false,
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

  //add event listener for add note
  const textareNewNote = document.getElementById("admin-textarea-new-note")
  textareNewNote.addEventListener("keypress", (e) => onAddNote(e))

  const inputNewTag = document.getElementById(CURRENT_TAG_ID)

  //add event listener for changed input
  inputNewTag.addEventListener("input", onChangeInputTag)

  //add event listener for add tag. Tag added by press Enter.
  inputNewTag.addEventListener("keypress", onKeyPressInputTag)

  renderNotes()

  renderTags()
}

//show slides, data is [{main, optional, date}]
//property is {interval:boolean, interval:seconds}
//TODO realize infinite
function showSlides(data, { infinite, interval } = { infinite: false, interval: 3 }) {
  const rootSlides = document.getElementById("container-slide")

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

  //create iterator for leaf slides
  function* getIteratorData() {yield* data}
  const iteratorSlide = getIteratorData()

  const changeSlidesInterval = setInterval(() => {
    const item = iteratorSlide.next()
    if (item.done) {
      return clearInterval(changeSlidesInterval)
    }
    //TODO add other datas on slide
    //TODO realize first slide immediately
    slideDate.innerText = item.value.date.slice(0, 10)
    slideOptional.innerText = item.value.optional
    slideMain.innerText = item.value.main
  }, interval * 1000)
  return changeSlidesInterval
}

//TODO add mange slides arrow keys and edit on current, also pause
function showSlidesCurrentNotes() {
  //if slides shows close them
  if (state.showSlides) {
    //TODO clear interval changeSlidesInterval
    state.showSlides = false
    document.getElementById("container-slides").innerHTML = ""
    return
  }
  api.getNotes({ tagId: state.currentTag._id }).then((notes) => {
    const notesMappedToSlide = notes.map((note) => ({
      main: note.name,
      optional: note.tag.name,
      date: note.created_at,
    }))
    //TODO relocate show slides to separate components which will store interval
    const interval = showSlides(notesMappedToSlide)
    state.showSlides = true
  })
}

function renderTag(tag) {
  const tagOption = document.createElement("option")
  tagOption.innerText = tag.name
  document.getElementById("admin-tags-notes").prepend(tagOption)
}

function renderErrorTag(err) {
  const inputTagList = document.getElementById("admin-current-tag")
  inputTagList.value = err
  inputTagList.classList.add("error")
}

function renderNote(note) {
  const noteDiv = document.createElement("div")
  noteDiv.classList.add("admin-notes__item")
  noteDiv.classList.add("_anim_item")

  const noteTagDiv = document.createElement("div")
  noteTagDiv.classList.add("admin-notes__item-tag")
  noteTagDiv.innerText = note.tag.name

  const noteNameDiv = document.createElement("div")
  noteNameDiv.classList.add("admin-notes__item-name")
  noteNameDiv.innerText = note.name

  noteDiv.append(noteTagDiv)
  noteDiv.append(noteNameDiv)
  document.getElementById(NOTES_ID).prepend(noteDiv)
}

function renderErrorNote(err) {
  const noteDiv = document.createElement("div")
  noteDiv.classList.add("admin-notes__item")
  noteDiv.classList.add("_anim_item")
  noteDiv.classList.add("error")
  noteDiv.innerText = err
  document.getElementById(NOTES_ID).appendChild(noteDiv)
}

//add note by pressing Enter
function onAddNote(e) {
  if (e.key === "Enter") {
    e.preventDefault()
    const noteText = document.getElementById("admin-textarea-new-note").value
    const tagId = state.currentTag._id
    if (tagId && noteText) {
      const newPost = { tag: tagId, name: noteText }
      api
        .postNote(newPost)
        .then((res) => {
          if (res.success) {
            //render new note then go back from api
            renderNote(res.data)
            document.getElementById("admin-textarea-new-note").value = ""
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
    rerenderNotes({ tagId: tag._id })
  }
}

function getTagByName(name) {
  let [tag] = state.tags.filter((tag) => tag.name === name)
  return tag
}

//filter object {tagId: value}
//get notes and render them or render error
//TODO add number notes for refer by number to note for edit (!23 edit or !22 del)
function renderNotes(filter) {
  api
    .getNotes(filter)
    .then((notes) => {
      notes.forEach((note) => {
        renderNote(note)
      })
    })
    .catch((err) => renderErrorNote(err))
}

//get tags and render them in input list or render error
function renderTags() {
  api
    .getTags()
    .then((tags) => {
      state.tags = tags
      tags.forEach((tag) => {
        renderTag(tag)
      })
    })
    .catch((err) => renderErrorTag(err))
}

function rerenderNotes(filter) {
  document.getElementById(NOTES_ID).innerText = ""
  renderNotes(filter)
}

function renderCLI() {
  const exist = document.getElementById("input-cli")
  if (exist) {
    exist.remove()
    return
  }
  const rootCLI = document.getElementById("admin-cli")
  const inputCLI = document.createElement("input")
  inputCLI.type = "text"
  inputCLI.classList.add("page__cli")
  inputCLI.id = "input-cli"

  rootCLI.appendChild(inputCLI)
  inputCLI.focus()
  inputCLI.addEventListener("keypress", onKeyPressInputCLI)
}

//TODO add edit and delete note by number (realize number note before) (!23 edit or !22 del)
//hadler keypress cli
function onKeyPressInputCLI(e) {
  if (e.key !== "Enter") {
    return
  }
  const command = e.target.value
  const [name, value] = command.split(" ")

  if (name === "tag" && !value) {
    //clear input tags and from state
    document.getElementById(CURRENT_TAG_ID).value = ""
    state.currentTag = ""

    //rerender all notes
    return rerenderNotes()
  }

  const tag = getTagByName(value)
  //filter by tag
  if (name === "tag" && tag) {
    //insert tagname in input, change current name tag
    document.getElementById(CURRENT_TAG_ID).value = tag.name
    state.currentTag = tag

    rerenderNotes({ tagId: tag._id })
  }
}

export const admin = {
  init,
}
