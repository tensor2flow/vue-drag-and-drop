export default {
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