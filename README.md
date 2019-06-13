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
            <dragging v-model="items">
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
        <v-dragging-list v-model="items">
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

Find more documentation from [Vue.Draggable](https://github.com/SortableJS/Vue.Draggable).
