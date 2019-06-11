import Sortable from 'sortablejs'
import { camelize, console } from './helper'
import methods from './methods'

function buildAttribute(object, propName, value) {
  if (value === undefined) {
    return object
  }
  object = object || {}
  object[propName] = value
  return object
}

function emit(evtName, evtData) {
  this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData))
}

function delegateAndEmit(evtName) {
  return evtData => {
    if (this.realList !== null) {
      this['onDrag' + evtName](evtData)
    }
    emit.call(this, evtName, evtData)
  };
}

function isTransition(slots) {
  if (!slots || slots.length !== 1) {
    return false;
  }
  const [{ componentOptions }] = slots
  if (!componentOptions) {
    return false;
  }
  return ['transition-group', 'TransitionGroup'].includes(componentOptions.tag);
}

function computeChildrenAndOffsets(children, { header, footer }) {
  let headerOffset = 0
  let footerOffset = 0
  if (header) {
    headerOffset = header.length
    children = children ? [...header, ...children] : [...header]
  }
  if (footer) {
    footerOffset = footer.length
    children = children ? [...children, ...footer] : [...footer]
  }
  return { children, headerOffset, footerOffset }
}

function getComponentAttributes($attrs, componentData) {
  let attributes = null;
  const update = (name, value) => {
    attributes = buildAttribute(attributes, name, value)
  };
  const attrs = Object.keys($attrs)
    .filter(key => key === 'id' || key.startsWith('data-'))
    .reduce((res, key) => {
      res[key] = $attrs[key]
      return res;
    }, {});
  update('attrs', attrs)

  if (!componentData) {
    return attributes;
  }
  const { on, props, attrs: componentDataAttrs } = componentData
  update('on', on)
  update('props', props)
  Object.assign(attributes.attrs, componentDataAttrs)
  return attributes
}

const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End']
const eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone']

const props = {
  options: Object,
  list: {
    type: Array,
    required: false,
    default: null
  },
  value: {
    type: Array,
    required: false,
    default: null
  },
  noTransitionOnDrag: {
    type: Boolean,
    default: false
  },
  clone: {
    type: Function,
    default: original => {
      return original
    }
  },
  element: {
    type: String,
    default: 'div'
  },
  tag: {
    type: String,
    default: null
  },
  move: {
    type: Function,
    default: null
  },
  componentData: {
    type: Object,
    required: false,
    default: null
  }
}

const render = function(h){
  const slots = this.$slots.default;
  this.transitionMode = isTransition(slots)
  const { children, headerOffset, footerOffset } = computeChildrenAndOffsets(
    slots,
    this.$slots
  );
  this.headerOffset = headerOffset;
  this.footerOffset = footerOffset;
  const attributes = getComponentAttributes(this.$attrs, this.componentData)
  return h(this.getTag(), attributes, children)
}

const created = function() {
  if (this.list !== null && this.value !== null) {
    console.error('Value and list props are mutually exclusive! Please set one or another.')
  }

  if (this.element !== "div") {
    console.warn('Element props is deprecated please use tag props instead. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#element-props');
  }

  if (this.options !== undefined) {
    console.warn('Options props is deprecated, add sortable options directly as vue.draggable item, or use v-bind. See https://github.com/SortableJS/Vue.Draggable/blob/master/documentation/migrate.md#options-props');
  }
}

const mounted = function() {
  this.noneFunctionalComponentMode =
    this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase();
  if (this.noneFunctionalComponentMode && this.transitionMode) {
    throw new Error(
      `Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.getTag()}`
    );
  }
  var optionsAdded = {};
  eventsListened.forEach(elt => {
    optionsAdded['on' + elt] = delegateAndEmit.call(this, elt);
  });

  eventsToEmit.forEach(elt => {
    optionsAdded['on' + elt] = emit.bind(this, elt)
  });

  const attributes = Object.keys(this.$attrs).reduce((res, key) => {
    res[camelize(key)] = this.$attrs[key]
    return res
  }, {});

  const options = Object.assign({}, this.options, attributes, optionsAdded, {
    onMove: (evt, originalEvent) => {
      return this.onDragMove(evt, originalEvent)
    }
  });
  !('draggable' in options) && (options.draggable = '>*')
  this._sortable = new Sortable(this.rootContainer, options)
  this.computeIndexes()
}


const watch = {
  options: {
    handler(newOptionValue) {
      this.updateOptions(newOptionValue)
    },
    deep: true
  },

  $attrs: {
    handler(newOptionValue) {
      this.updateOptions(newOptionValue)
    },
    deep: true
  },

  realList() {
    this.computeIndexes()
  }
}

const data = {
  transitionMode: false,
  noneFunctionalComponentMode: false,
  init: false
}

const draggbale = {
  inheritAttrs: false,
  data: () => data,
  props,
  created,
  mounted,
  beforeDestroy() {
    if (this._sortable !== undefined) this._sortable.destroy();
  },
  computed: {
    rootContainer() {
      return this.transitionMode ? this.$el.children[0] : this.$el
    },
    realList() {
      return this.list ? this.list : this.value
    }
  },
  watch,
  methods
}

const draggableComponent = {
  name: 'draggable',
  mixins: [draggbale],
  render
}

export default draggableComponent