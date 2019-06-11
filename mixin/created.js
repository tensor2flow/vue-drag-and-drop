import { console } from '../utils/helper'

const created = function() {
  if (this.list !== null && this.value !== null) {
    console.error('Value and list props are mutually exclusive! Please set one or another.')
  }

  if (this.element !== "div") {
    console.warn('Element props is deprecated please use tag props instead');
  }

  if (this.options !== undefined) {
    console.warn('Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind');
  }
}

export default created