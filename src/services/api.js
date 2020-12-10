import { postData, deleteData } from "../helpers/utils"

const URL = "http://localhost:3001/api"

const getPosts = (page) => {
  return fetch(`${URL}/post/${page}`)
    .then((response) => response.json())
    .then((data) => data.data)
}

const getTags = () => {
  return fetch(`${URL}/tag/`)
    .then((response) => response.json())
    .then((data) => data.data)
}

const getNotes = (filter = {}) => {
  let endURL = ""
  const { tagId, _id } = filter
  if (tagId) {
    endURL = `byTag/${tagId}`
  }
  if (_id) {
    endURL = `${_id}`
  }
  return fetch(`${URL}/note/${endURL}`)
    .then((response) => response.json())
    .then((data) => data.data)
}

const deletePost = (id) => {
  return deleteData(`${URL}/note/${id}`)
    .then((response) => response.json())
    .then((data) => data.data)
}

const postTag = (tagName) => {
  return postData(`${URL}/tag`, { name: tagName }).then((data) => data.json())
}

const postNote = (note) => {
  return postData(`${URL}/note`, note).then((data) => data.json())
}

export const api = {
  getPosts,
  getTags,
  getNotes,
  postTag,
  postNote,
  deletePost,
}
