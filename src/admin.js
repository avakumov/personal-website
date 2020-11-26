import { api } from "./services/api"

const state = {
  tags: [],
  currentTag: "",
}

function init() {
  //add event listener for add note
  const textareNewNote = document.getElementById("admin-textarea-new-note")
  textareNewNote.addEventListener("keypress", (e) => onAddNote(e))

  const admin_current_tag = "admin-current-tag"
  const inputNewTag = document.getElementById(admin_current_tag)

  //add event listener for changed input
  inputNewTag.addEventListener("input", () => {
    console.log(document.getElementById(admin_current_tag).value)
    const tagText = document.getElementById(admin_current_tag).value

    //add tag to state.current if exist in the database
    let [tag] = state.tags.filter((tag) => tag.name === tagText)
    state.currentTag = tag
  })

  //add event listener for add tag. Tag added by press Enter.
  inputNewTag.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const newTag = document.getElementById(admin_current_tag).value
      api
        .postTag(newTag)
        .then((data) => {
          if (data.success) {
            //TODO add green blink border on tags input
          }
        })
        .catch((err) => {
          //TODO error render
        })
    }
  })

  //get notes and render them or render error
  api
    .getNotes()
    .then((notes) => {
      notes.forEach((note) => {
        renderNote(note)
      })
    })
    .catch((err) => renderErrorNote(err))

  //get tags and render them in input list or render error
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

function renderTag(note) {
  const tagOption = document.createElement("option")
  tagOption.innerText = note.name
  document.getElementById("admin-tags-notes").appendChild(tagOption)
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
  noteDiv.innerHTML = note.name
  document.getElementById("admin-notes").prepend(noteDiv)
}

function renderErrorNote(err) {
  const noteDiv = document.createElement("div")
  noteDiv.classList.add("admin-notes__item")
  noteDiv.classList.add("_anim_item")
  noteDiv.classList.add("error")
  noteDiv.innerHTML = err
  document.getElementById("admin-notes").appendChild(noteDiv)
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
            document.getElementById("admin-textarea-new-note").innerText = ''
          }
        })
        .catch((err) => {
          console.log(err) //TODO show message
        })
    }
  }
}

export const admin = {
  init,
}
