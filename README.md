# vue-drag-and-drop

The Vue Dragging tools for easy create your vue components

[![GitHub open issues](https://img.shields.io/github/issues/tensor2flow/vue-drag-and-drop.svg)](https://github.com/tensor2flow/vuedragging/issues)
[![MIT License](https://img.shields.io/github/license/tensor2flow/vue-drag-and-drop.svg)](https://github.com/tensor2flow/vue-drag-and-drop/blob/master/LICENSE)

Note : I added the `mixin` and `createSimpleDraggable` features to [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable)

## Install
```
npm install @tensor2flow/vuedragging
```

## Features

* Full support of [Sortable.js](https://github.com/RubaXa/Sortable) features:
    * Supports touch devices
    * Supports drag handles and selectable text
    * Smart auto-scrolling
    * Support drag and drop between different lists
    * No jQuery dependency
* Full support of [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable) features:
    * Keeps in sync HTML and view model list
    * Compatible with Vue.js 2.0 transition-group
    * Cancellation support
    * Events reporting any changes when full control is needed
    * Reuse existing UI library components (such as [vuetify](https://vuetifyjs.com), [element](http://element.eleme.io/), or [vue material](https://vuematerial.io) etc...) and make them draggable using `tag` and `componentData` props
* Implement dragging features to ready components
* Create draggable component by using dragging mixin

## Init as plugin
```js
import Vue from 'vue'
import Dragging from '@tensor2flow/vuedragging'

Vue.use(Dragging)
```

## Init as component
```js
import Vue from 'vue'
import Draggable from '@tensor2flow/vuedragging/component'

Vue.component('draggable', Draggable)
```

## Usage
```html
<template>
    <v-app>
        <v-list>
            <dragging v-model="items" group="items" @start="drag=true" @end="drag=false">
                <v-list-tile v-for="(item, i) in items" v-bind:key="i">
                    {{item}}
                </v-list-tile>
            </dragging>
        </v-list>
    <v-app>
</template>
<script>
export default {
    name: 'App',
    data: () => ({
        items: ['Item1', 'Item2', 'Item3', 'Item4']
    })
}
</script>
```

Create your component with dragging features
```html
<template>
    ...
</template>
<script>
import dragging from '@tensor2flow/vuedragging/mixin'
export default {
    name: '...',
    mixins: [dragging]
}
</script>
```

Implements dragging features to component
```html
<template>
    <v-app>
        <v-dragging-list v-model="items" group="items" @start="drag=true" @end="drag=false">
            <v-list-tile v-for="(item, i) in items" v-bind:key="i">
                {{item}}
            </v-list-tile>
        </v-dragging-list>
    <v-app>
</template>
<script>
import { VList } from 'vuetify/lib'

import { createSimpleDraggable } from '@tensor2flow/vuedragging/utils'
const VDraggingList = createSimpleDraggable('v-list', VList)

// Or
import Vue from 'vue'
const VDraggingList = Vue.$dragging.createSimpleDraggable('v-list', VList)

export default {
    name: 'App',
    components: { 'v-dragging-list' : VDraggingList },
    data: () => ({
        items: ['Item1', 'Item2', 'Item3', 'Item4']
    })
}
</script>
```
## With `transition-group`:
```html
<v-dragging-list v-model="items" group="items" @start="drag=true" @end="drag=false">
   <transition-group>
      <v-list-tile v-for="(item, i) in items" v-bind:key="i">
          {{item}}
      </v-list-tile>
   </transition-group>
</v-dragging-list>
```
### Props
#### value
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Input array to draggable component. Typically same array as referenced by inner element v-for directive.<br>
This is the preferred way to use Vue.draggable as it is compatible with Vuex.<br>
It should not be used directly but only though the `v-model` directive:
```html
<draggable v-model="myArray">
```

#### list
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Alternative to the `value` prop, list is an array to be synchronized with drag-and-drop.<br>
The main difference is that `list` prop is updated by draggable component using splice method, whereas `value` is immutable.<br>
**Do not use in conjunction with value prop.**

#### All sortable options
New in version 2.19

Sortable options can be set directly as vue.draggable props since version 2.19.

This means that all [sortable option](https://github.com/RubaXa/Sortable#options) are valid sortable props with the notable exception of all the method starting by "on" as draggable component expose the same API via events.

kebab-case propery are supported: for example `ghost-class` props will be converted to `ghostClass` sortable option.

Example setting handle, sortable and a group option:
```HTML
<dragging
        v-model="list"
        handle=".handle"
        :group="{ name: 'people', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        @change="log"
      >
      <!-- -->
</dragging>
```

#### tag
Type: `String`<br>
Default: `'div'`

HTML node type of the element that draggable component create as outer element for the included slot.<br>
It is also possible to pass the name of vue component as element. In this case, draggable attribute will be passed to the create component.<br>
See also [componentData](#componentdata) if you need to set props or event to the created component.

#### clone
Type: `Function`<br>
Required: `false`<br>
Default: `(original) => { return original;}`<br>

Function called on the source component to clone element when clone option is true. The unique argument is the viewModel element to be cloned and the returned value is its cloned version.<br>
By default vue.draggable reuses the viewModel element, so you have to use this hook if you want to clone or deep clone it.

#### move
Type: `Function`<br>
Required: `false`<br>
Default: `null`<br>

If not null this function will be called in a similar way as [Sortable onMove callback](https://github.com/RubaXa/Sortable#move-event-object).
Returning false will cancel the drag operation.

```javascript
function onMoveCallback(evt, originalEvent){
   ...
    // return false; — for cancel
}
```
evt object has same property as [Sortable onMove event](https://github.com/RubaXa/Sortable#move-event-object), and 3 additional properties:
 - `draggedContext`:  context linked to dragged element
   - `index`: dragged element index
   - `element`: dragged element underlying view model element
   - `futureIndex`:  potential index of the dragged element if the drop operation is accepted
 - `relatedContext`: context linked to current drag operation
   - `index`: target element index
   - `element`: target element view model element
   - `list`: target list
   - `component`: target VueComponent

HTML:
```HTML
<dragging :list="list" :move="checkMove">
```
javascript:
```javascript
checkMove: function(evt){
    return (evt.draggedContext.element.name!=='apple');
}
```
See complete example: [Cancel.html](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/Cancel.html), [cancel.js](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/script/cancel.js)

#### componentData
Type: `Object`<br>
Required: `false`<br>
Default: `null`<br>

This props is used to pass additional information to child component declared by [tag props](#tag).<br>
Value:
* `props`: props to be passed to the child component
* `attrs`: attrs to be passed to the child component
* `on`: events to be subscribe in the child component

Example (using [element UI library](http://element.eleme.io/#/en-US)):
```HTML
<dragging tag="el-collapse" :list="list" :component-data="getComponentData()">
    <el-collapse-item v-for="e in list" :title="e.title" :name="e.name" :key="e.name">
        <div>{{e.description}}</div>
     </el-collapse-item>
</dragging>
```
```javascript
methods: {
    handleChange() {
      console.log('changed');
    },
    inputChanged(value) {
      this.activeNames = value;
    },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        attrs:{
          wrap: true
        },
        props: {
          value: this.activeNames
        }
      };
    }
  }
```

### Events

* Support for Sortable events:

  `start`, `add`, `remove`, `update`, `end`, `choose`, `sort`, `filter`, `clone`<br>
  Events are called whenever onStart, onAdd, onRemove, onUpdate, onEnd, onChoose, onSort, onClone are fired by Sortable.js with the same argument.<br>
  [See here for reference](https://github.com/RubaXa/Sortable#event-object-demo)

  Note that SortableJS OnMove callback is mapped with the [move prop](https://github.com/SortableJS/Vue.Draggable/blob/master/README.md#move)

HTML:
```HTML
<dragging :list="list" @end="onEnd">
```

* change event

  `change` event is triggered when list prop is not null and the corresponding array is altered due to drag-and-drop operation.<br>
  This event is called with one argument containing one of the following properties:
  - `added`:  contains information of an element added to the array
    - `newIndex`: the index of the added element
    - `element`: the added element
  - `removed`:  contains information of an element removed from to the array
    - `oldIndex`: the index of the element before remove
    - `element`: the removed element
  - `moved`:  contains information of an element moved within the array
    - `newIndex`: the current index of the moved element
    - `oldIndex`: the old index of the moved element
    - `element`: the moved element

Find more documentation from [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable).
