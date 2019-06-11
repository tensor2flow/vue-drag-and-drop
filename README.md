# vuedragging

<<<<<<< HEAD
The Vue Dragging tools for easy create your vue components

## Install
```
npm install @tensor2flow/vuegragging
=======
The Vue Dragging tools for easy create your vue draggable components

[![GitHub open issues](https://img.shields.io/github/issues/tensor2flow/vuedragging.svg)](https://github.com/tensor2flow/vuedragging/issues)
[![MIT License](https://img.shields.io/github/license/tensor2flow/vuedragging.svg)](https://github.com/tensor2flow/vuedragging/blob/master/LICENSE)

Note : I added the `mixin` and `createSimpleDraggable` features to [VueDraggable](https://github.com/SortableJS/Vue.Draggable)

## Install
```
npm install @tensor2flow/vuedragging
>>>>>>> eaec9e08c62a915a927b52d61eaec2e2fa5d9834
```

## Install as plugin
```js
import Vue from 'vue'
<<<<<<< HEAD
import Dragging from 'vuedragging'
=======
import Dragging from '@tensor2flow/vuedragging'
>>>>>>> eaec9e08c62a915a927b52d61eaec2e2fa5d9834

Vue.use(Dragging)
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
<<<<<<< HEAD
            <dragging v-model="list">
=======
            </dragging>
>>>>>>> eaec9e08c62a915a927b52d61eaec2e2fa5d9834
        </v-list>
        </dragging>
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

<<<<<<< HEAD
=======
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

>>>>>>> eaec9e08c62a915a927b52d61eaec2e2fa5d9834
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
