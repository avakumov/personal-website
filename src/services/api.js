



const getEntities = () => {
    return fetch('http://localhost:1337/entities/')
  .then(response => response.json())
}



export const api = {
    getEntities
}