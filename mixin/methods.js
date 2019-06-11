import { insertNodeAt, camelize, removeNode } from '../utils/helper'

const eventsListened = ['Start', 'Add', 'Remove', 'Update', 'End']
const eventsToEmit = ['Choose', 'Sort', 'Filter', 'Clone']
const readonlyProperties = ['Move', ...eventsListened, ...eventsToEmit].map(
  evt => 'on' + evt
)

var draggingElement = null

function computeVmIndex(vnodes, element) {
  return vnodes.map(elt => elt.elm).indexOf(element)
}

function computeIndexes(slots, children, isTransition, footerOffset) {
  if (!slots) {
    return []
  }

  const elmFromNodes = slots.map(elt => elt.elm)
  const footerIndex = children.length - footerOffset
  const rawIndexes = [...children].map((elt, idx) =>
    idx >= footerIndex ? elmFromNodes.length : elmFromNodes.indexOf(elt)
  );
  return isTransition ? rawIndexes.filter(ind => ind !== -1) : rawIndexes
}

export default {
  getTag() {
		return this.tag || this.element
	},

	updateOptions(newOptionValue) {
		for (var property in newOptionValue) {
			const value = camelize(property)
			if (readonlyProperties.indexOf(value) === -1) {
				this._sortable.option(value, newOptionValue[property])
			}
		}
	},

	getChildrenNodes() {
		if (!this.init) {
			this.noneFunctionalComponentMode =
				this.noneFunctionalComponentMode && this.$children.length === 1
			this.init = true
		}

		if (this.noneFunctionalComponentMode) {
			return this.$children[0].$slots.default
		}
		const rawNodes = this.$slots.default
		return this.transitionMode ? rawNodes[0].child.$slots.default : rawNodes
	},

	computeIndexes() {
		this.$nextTick(() => {
			this.visibleIndexes = computeIndexes(
				this.getChildrenNodes(),
				this.rootContainer.children,
				this.transitionMode,
				this.footerOffset
			);
		});
	},

	getUnderlyingVm(htmlElt) {
		const index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);
		if (index === -1) {
			return null;
		}
		const element = this.realList[index];
		return { index, element };
	},

	getUnderlyingPotencialDraggableComponent({ __vue__ }) {
		if (!__vue__ || !__vue__.$options || __vue__.$options._componentTag !== 'transition-group') {
			return __vue__
		}
		return __vue__.$parent
	},

	emitChanges(evt) {
		this.$nextTick(() => {
			this.$emit('change', evt)
		});
	},

	alterList(onList) {
		if (this.list) {
			onList(this.list)
			return;
		}
		const newList = [...this.value];
		onList(newList)
		this.$emit('input', newList)
	},

	spliceList() {
		const spliceList = list => list.splice(...arguments)
		this.alterList(spliceList)
	},

	updatePosition(oldIndex, newIndex) {
		const updatePosition = list =>
			list.splice(newIndex, 0, list.splice(oldIndex, 1)[0])
		this.alterList(updatePosition);
	},

	getRelatedContextFromMoveEvent({ to, related }) {
		const component = this.getUnderlyingPotencialDraggableComponent(to)
		if (!component) {
			return { component }
		}
		const list = component.realList
		const context = { list, component }
		if (to !== related && list && component.getUnderlyingVm) {
			const destination = component.getUnderlyingVm(related)
			if (destination) {
				return Object.assign(destination, context)
			}
		}
		return context
	},

	getVmIndex(domIndex) {
		const indexes = this.visibleIndexes
		const numberIndexes = indexes.length
		return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex]
	},

	getComponent() {
		return this.$slots.default[0].componentInstance
	},

	resetTransitionData(index) {
		if (!this.noTransitionOnDrag || !this.transitionMode) {
			return;
		}
		var nodes = this.getChildrenNodes()
		nodes[index].data = null
		const transitionContainer = this.getComponent()
		transitionContainer.children = []
		transitionContainer.kept = undefined
	},

	onDragStart(evt) {
		this.context = this.getUnderlyingVm(evt.item)
		evt.item._underlying_vm_ = this.clone(this.context.element)
		draggingElement = evt.item
	},

	onDragAdd(evt) {
		const element = evt.item._underlying_vm_
		if (element === undefined) {
			return;
		}
		removeNode(evt.item)
		const newIndex = this.getVmIndex(evt.newIndex)
		this.spliceList(newIndex, 0, element)
		this.computeIndexes()
		const added = { element, newIndex }
		this.emitChanges({ added })
	},

	onDragRemove(evt) {
		insertNodeAt(this.rootContainer, evt.item, evt.oldIndex)
		if (evt.pullMode === "clone") {
			removeNode(evt.clone)
			return;
		}
		const oldIndex = this.context.index
		this.spliceList(oldIndex, 1)
		const removed = { element: this.context.element, oldIndex }
		this.resetTransitionData(oldIndex)
		this.emitChanges({ removed })
	},

	onDragUpdate(evt) {
		removeNode(evt.item)
		insertNodeAt(evt.from, evt.item, evt.oldIndex)
		const oldIndex = this.context.index
		const newIndex = this.getVmIndex(evt.newIndex)
		this.updatePosition(oldIndex, newIndex)
		const moved = { element: this.context.element, oldIndex, newIndex }
		this.emitChanges({ moved })
	},

	updateProperty(evt, propertyName) {
		evt.hasOwnProperty(propertyName) &&
			(evt[propertyName] += this.headerOffset)
	},

	computeFutureIndex(relatedContext, evt) {
		if (!relatedContext.element) {
			return 0
		}
		const domChildren = [...evt.to.children].filter(
			el => el.style['display'] !== 'none'
		);
		const currentDOMIndex = domChildren.indexOf(evt.related)
		const currentIndex = relatedContext.component.getVmIndex(currentDOMIndex)
		const draggedInList = domChildren.indexOf(draggingElement) !== -1
		return draggedInList || !evt.willInsertAfter ? currentIndex : currentIndex + 1
	},

	onDragMove(evt, originalEvent) {
		const onMove = this.move
		if (!onMove || !this.realList) {
			return true
		}

		const relatedContext = this.getRelatedContextFromMoveEvent(evt)
		const draggedContext = this.context
		const futureIndex = this.computeFutureIndex(relatedContext, evt)
		Object.assign(draggedContext, { futureIndex })
		const sendEvt = Object.assign({}, evt, {
			relatedContext,
			draggedContext
		});
		return onMove(sendEvt, originalEvent)
	},

	onDragEnd() {
		this.computeIndexes()
		draggingElement = null
	}
}