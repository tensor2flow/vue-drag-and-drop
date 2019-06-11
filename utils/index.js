import mixin from '../mixin'

const createSimpleDraggable = function(name, component){
    return {
        name,
        extends: component,
        mixins: [mixin]
    }
}

export { createSimpleDraggable }