export default {
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