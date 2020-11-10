import './styles/main.scss'
import { api } from './services/api'
import {auth} from './auth'



auth.init()

const p = getComputedStyle(document.documentElement)
    .getPropertyValue('--entity')
console.log(p)

api.getEntities().then(entities => {
    const mapedEntities = entities.map(entity => {
        return {
            id: entity.id,
            title: entity.title
        }
    })
    mapedEntities.map( entity => {
        addElement(entity.title)
    })
    console.log(mapedEntities)
})

function addElement (text) { 
    const newDiv = document.createElement("div"); 
    newDiv.innerHTML = text 
    newDiv.classList.add("entity")
    newDiv.setAttribute("id", text)
    document.getElementById("entities").appendChild(newDiv); 
  }

window.addEventListener('scroll', () => animateOnScroll(100))

function animateOnScroll (deltaY) {
    const animItems = document.querySelectorAll('._anim_item')
    
    animItems.forEach( (el, index) => {
        const ItemRect = el.getBoundingClientRect()
        const topItem = ItemRect.top
        const bottomItem = ItemRect.bottom
        const windowHeigth = window.innerHeight


        //bottom animation hidden, appear
        let deltaBottom = windowHeigth - topItem
        if (deltaBottom < deltaY) {
            el.classList.add('_down-hidden')
        } else {
            el.classList.remove('_down-hidden')
        }


        //top animation hidden, appear
        let deltaTop = bottomItem
        if (deltaTop < deltaY) {
            el.classList.add('_up-hidden')
        } else {
            el.classList.remove('_up-hidden')
        }
    })
}