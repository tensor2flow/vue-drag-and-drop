import draggable from './component'
import { createSimpleDraggable } from './utils'

export default {
  install(Vue){
    const options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {}
    Vue.prototype.$dragging = new Vue({
      name: 'dragging',
      methods: {
        createSimpleDraggable
      }
    })
    if(options.init === undefined || options.init !== false){
      if(options.escape !== undefined && options.escape.name !== undefined){
        Vue.component(options.escape.name, draggable)
      }
      else{
        Vue.component('dragging', draggable)
      }
    }
  },
  version: '1.0.0'
}