import { postData, deleteData, putData } from "../helpers/utils"

let host = "localhost"
if (process.env.NODE_ENV === "production") {
  host = "avamir.ru"
}
const URL = `http://${host}:3001/api`

/**
 * Get entities by name and filter
 * @param  {string} name     Name of entity
 * @param  {Object} filter Filter object
 * @return {Promise} promise
 */
const get = (name, filter = {}) => {
  let params = "?"
  for (let key in filter) {
    params += `${key}=${filter[key]}`
  }
  return fetch(`${URL}/${name}/${params}`).then((response) => response.json())
}

/**
 * Get entities by name and filter
 * @param  {string} name     Name of entity
 * @param  {Object} data Object to save
 * @return {Promise} promise
 */
const post = (name, data) => {
  return postData(`${URL}/${name}`, data).then((data) => data.json())
}

const deletePost = (id) => {
  return deleteData(`${URL}/note/${id}`)
    .then((response) => response.json())
    .then((data) => data.data)
}

const putNote = (note) => {
  const id = note._id
  if (id) {
    delete note._id
  }
  return putData(`${URL}/note/${id}`, note).then((response) => response.json())
}

export const api = {
  get,
  post,
  deletePost,
  putNote,
}
