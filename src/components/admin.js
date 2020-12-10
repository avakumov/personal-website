import { api } from "../services/api"
import { createContext } from "../helpers/hotkeys"
import { ShowSlides } from "./slide"
import { CURRENT_TAG_ID, NOTES_ID, SLIDES_ID, CLI_ID, TAGS_ID } from "../globals"

//TODO relocate state
const state = {
  tags: [],
  currentTag: "",
  showSlides: null,
  editingNote: null,
  countNumberNoteRender: 0,
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

function showSlidesCurrentNotes() {
  //if slides shows close them
  if (state.showSlides) {
    state.showSlides.stop()
    state.showSlides = null
    return
  }
  if (!state.currentTag) {
    console.log("ERROR")
    return
  }
  api.getNotes({ tagId: state.currentTag._id }).then((notes) => {
    const notesMappedToSlide = notes.map((note) => ({
      main: note.name,
      optional: note.tag.name,
      date: note.created_at,
    }))
    state.showSlides = new ShowSlides(SLIDES_ID, notesMappedToSlide)
    state.showSlides.start()
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

function renderNote(note, index) {
  state.countNumberNoteRender++
  const noteDiv = document.createElement("div")
  noteDiv.classList.add("admin-notes__item")
  noteDiv.classList.add("_anim_item")

  //for refer edit, delete
  noteDiv.setAttribute("id", note._id)
  noteDiv.setAttribute("number", index)

  const noteTagDiv = document.createElement("div")
  noteTagDiv.classList.add("admin-notes__item-tag")
  noteTagDiv.innerText = note.tag.name

  const noteNumberDiv = document.createElement("div")
  noteNumberDiv.classList.add("admin-notes__item-number")
  noteNumberDiv.innerText = index

  const noteNameDiv = document.createElement("div")
  noteNameDiv.classList.add("admin-notes__item-name")
  noteNameDiv.innerText = note.name

  noteDiv.append(noteTagDiv)
  noteDiv.append(noteNumberDiv)
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
    const noteTextarea = document.getElementById("admin-textarea-new-note")
    noteTextarea.classList.remove("blink-error")
    e.preventDefault()
    if (state.editingNote) {
      //TODO edit note
    }

    const noteText = noteTextarea.value
    const tagId = state.currentTag._id
    if (tagId && noteText) {
      const newNote = { tag: tagId, name: noteText }
      api
        .postNote(newNote)
        .then((res) => {
          if (res.success) {
            //другие также обрабатывать
            //render new note then go back from api
            renderNote(res.data, state.countNumberNoteRender)
            document.getElementById("admin-textarea-new-note").value = ""
            // TODO blink new note  if note saved
            
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
    return rerenderNotes({ tagId: tag._id })
  }
  //nothing
  //TODO render nothing
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
      //reset numbers notes
      state.countNumberNoteRender = 0
      notes.forEach((note, index) => {
        renderNote(note, index)
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
  const rootCLI = document.getElementById(CLI_ID)
  const inputCLI = document.createElement("input")
  inputCLI.type = "text"
  inputCLI.classList.add("page__cli")
  inputCLI.id = "input-cli"

  rootCLI.appendChild(inputCLI)
  inputCLI.focus()
  inputCLI.addEventListener("keypress", onKeyPressInputCLI)
}

//TODO add edit and  note by number
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

      rerenderNotes({ tagId: tag._id })
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
          .getNotes({ _id: id })
          .then((res) => {
            const [note] = res
            if (note) {
              state.editingNote = note
              document.getElementById("admin-textarea-new-note").value = note.name
              document.getElementById(CURRENT_TAG_ID).value = note.tag.name
              //realize put note
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
