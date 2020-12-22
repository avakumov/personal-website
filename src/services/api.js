

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
 * Create entity by name of entity
 * @param  {string} name     Name of entity
 * @param  {Object} data Object to save
 * @return {Promise} promise
 */
const post = (name, data) => {
  return postData(`${URL}/${name}`, data).then((data) => data.json())
}

/**
 * Remove entity by id
 * @param  {string} name     Name of entity
 * @param  {Object} data Object to delete
 * @return {Promise} promise
 */
const remove = (name, id) => {
  return deleteData(`${URL}/${name}/${id}`)
    .then((response) => response.json())
}


const put = (name, entity) => {
  // const id = entity._id
  // if (id) {
  //   delete note._id
  // }
  return putData(`${URL}/${name}/${entity._id}`, entity).then((response) => response.json())
}

export const api = {
  get,
  post,
  remove,
  put,
}

function postData  (url = "", data = {}) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

function deleteData (url = "")  {
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

function putData(url = "", data = {})  {
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}