// If you use require (Node etc), require as first the module and then create the instance
import {Remarkable}  from 'remarkable'
// If you're in the browser, the Remarkable class is already available in the window
const  md = new Remarkable();


export const toHtml = (mdText) => {
    return md.render(mdText)
}