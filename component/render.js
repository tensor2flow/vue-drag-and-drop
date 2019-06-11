function buildAttribute(object, propName, value) {
  if (value === undefined) {
    return object
  }
  object = object || {}
  object[propName] = value
  return object
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

export default render