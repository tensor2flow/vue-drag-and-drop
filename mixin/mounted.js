import Sortable from 'sortablejs'
import { camelize } from '../utils/helper'

const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End']
const eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone']

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

const mounted = function() {
  this.noneFunctionalComponentMode =
    this.getTag().toLowerCase() !== this.$el.nodeName.toLowerCase();
  if (this.noneFunctionalComponentMode && this.transitionMode) {
    throw new Error(`Transition-group inside component is not supported. Please alter tag value or remove transition-group. Current tag value: ${this.getTag()}`);
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

export default mounted