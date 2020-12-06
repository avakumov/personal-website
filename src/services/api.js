import {postData} from '../helpers/utils'

const getPosts= (page) => {
  return fetch(`http://localhost:3001/api/post/${page}`)
.then(response => response.json())
.then(data => data.data)
}

const getTags= () => {
  return fetch(`http://localhost:3001/api/tag/`)
.then(response => response.json())
.then(data => data.data)
}

const getNotes= (filter={}) => {
  let endURL = ''
  const {tagId} = filter
  if (tagId) {
    endURL = `byTag/${tagId}`
  }
  return fetch(`http://localhost:3001/api/note/${endURL}`)
.then(response => response.json())
.then(data => data.data)
}

const postTag = (tagName) => {
  return postData("http://localhost:3001/api/tag", {name: tagName})
    .then((data) => data.json())
}

const postNote = (note) => {
  return postData("http://localhost:3001/api/note", note)
    .then((data) => data.json())
}


export const api = {
    getPosts,
    getTags,
    getNotes,
    postTag,
    postNote
}