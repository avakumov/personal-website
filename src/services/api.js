import { postData, deleteData, putData } from "../helpers/utils"

let host = "localhost"
if (process.env.NODE_ENV === 'production') {
  host = "avamir.ru"
}
const URL = `http://${host}:3001/api`

/**
 * Get entities by name and filter
 * @param  {string} name     Name of entity
 * @param  {Object} filter Filter object
 * @return {Promise} promise
 */
const getEntities = (name, filter={}) => {
  let params = "?"
  for (let key in filter) {
    params+=`${key}=${filter[key]}`
  }
  return fetch(`${URL}/${name}/${params}`)
    .then((response) => response.json())
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

const putNote= (note) => {
  const id = note._id
  if (id) {
    delete note._id
  }
  return putData(`${URL}/note/${id}`, note)
    .then((response) => response.json())
}

export const api = {
  getEntities,
  postTag,
  postNote,
  deletePost,
  putNote
}
