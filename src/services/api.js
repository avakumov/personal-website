

const getPosts= (page) => {
  return fetch(`http://localhost:3001/api/post/${page}`)
.then(response => response.json())
.then(data => data.data)
}


export const api = {
    getPosts
}