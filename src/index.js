import _ from 'lodash'
import './style.css'
// import Icon from './img/icon-128.png'
import printMe from './print.js'

function component () {
  let element = document.createElement('div')
  let button = document.createElement('button')

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')
  element.classList.add('hello')

  button.innerHTML = 'Check consolo'
  button.onclick = printMe
  // Add the image to our existing div.
  // var myIcon = new Image()
  // myIcon.src = Icon

  // element.appendChild(myIcon)
  element.appendChild(button)
  return element
}

document.body.appendChild(component())
