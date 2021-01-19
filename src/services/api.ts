import { URL_API as URL } from "../globals"

interface Response {
  success: boolean
  error?: string
  data?: []
}

/**
 * Get entities by name and filter
 * @param  {string} name     Name of entity
 * @param  {Object} filter Filter object
 * @return {Promise} promise
 */
const get = (name: string, filter: any = {}): Promise<Response> => {
  let params = "?"
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      params += `${key}=${filter[key]}&`
    }
  }
  return fetch(`${URL}/${name}/${params}`, {
    method: "GET",
    credentials: "include",
  }).then((response) => response.json())
}
/**
 * Create entity by name of entity
 * @param  {string} name     Name of entity
 * @param  {Object} data Object to save
 * @return {Promise} promise
 */
const post = (name: string, data: any): Promise<Response> => {
  return postData(`${URL}/${name}`, data).then((response) => response.json())
}
/**
 * Remove entity by id
 * @param  {string} name     Name of entity
 * @param  {Object} data Object to delete
 * @return {Promise} promise
 */
const remove = (name: string, id: string): Promise<Response> => {
  return deleteData(`${URL}/${name}/${id}`).then((response) => response.json())
}

const put = (name: string, entity: any): Promise<Response> => {
  return putData(`${URL}/${name}/${entity._id}`, entity).then((response) => response.json())
}

const getProfile = (): Promise<Response> => {
  return fetch(`${URL}/auth/profile`, { method: "GET", credentials: "include" }).then((response) =>
    response.json()
  )
}

export const api = {
  get,
  post,
  remove,
  put,
  getProfile,
}

function postData(url = "", data = {}) {
  return fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

function deleteData(url = "") {
  return fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

function putData(url = "", data = {}) {
  return fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}
