export function ref(varible) {
  const $ = {
    _this: {
      data: varible
    }
  }
  const { _this } = $

  // Object.defineProperty(_this, "data", {
  //   get() {
  //     return _this.data
  //   },
  //   set(value) {
  //     console.log("changed");
  //     _this.data = value
  //   }
  // })

  Object.defineProperty($, "_this", {
    get() {
      return this.data
    },
    set() {}
  })

  return $._this
}

export function reative(object) {

}