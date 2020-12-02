import { api } from "./services/api"
//classes 
const CURRENT_TAG_ID = "admin-current-tag"
const NOTES_ID = "admin-notes"

const state = {
  tags: [],
  currentTag: "",
}


function init() {
  //add event listener for add note
  const textareNewNote = document.getElementById("admin-textarea-new-note")
  textareNewNote.addEventListener("keypress", (e) => onAddNote(e))

  
  const inputNewTag = document.getElementById(CURRENT_TAG_ID)

  //add event listener for changed input
  inputNewTag.addEventListener("input", onChangeInputTag )

  //add event listener for add tag. Tag added by press Enter.
  inputNewTag.addEventListener("keypress", onKeyPressInputTag)

  renderNotes()

  renderTags()
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
  noteTagDiv.innerHTML = note.tag.name

  const noteNameDiv = document.createElement("div")
  noteNameDiv.classList.add("admin-notes__item-name")
  noteNameDiv.innerHTML = note.name

  noteDiv.append(noteTagDiv)
  noteDiv.append(noteNameDiv)
  document.getElementById(NOTES_ID).prepend(noteDiv)
}

function renderErrorNote(err) {
  const noteDiv = document.createElement("div")
  noteDiv.classList.add("admin-notes__item")
  noteDiv.classList.add("_anim_item")
  noteDiv.classList.add("error")
  noteDiv.innerHTML = err
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


function onKeyPressInputTag (e){
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

function onChangeInputTag () {
  const tagName = document.getElementById(CURRENT_TAG_ID).value

  //add tag to state.current if exist in the database
  const tag = getTagByName(tagName)
  state.currentTag = tag
  
  //rerender notes by filter tag
  if (tag) {
    rerenderNotes({tagId: tag._id})
  }
  
}

function getTagByName(name) {
  let [tag] = state.tags.filter((tag) => tag.name === name)
  return tag
}

//filter object {tagId: value}
//get notes and render them or render error
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
function renderTags(){
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

function rerenderNotes(filter){
  document.getElementById(NOTES_ID).innerHTML=''
  renderNotes(filter)
}

export const admin = {
  init,
  rerenderNotes,
  getTagByName
}
