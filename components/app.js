// import wdnmd from "./wdnmd.js";

export default {
  template: `
      <h1 asd="fghj">{{msg}}</h1>
      <button @click="counter">click me! count: {{ count }}</button>
      <div class="wdnmd"></div>
      <div class="aaa"></div>
    `,
  data: {
    msg: "Helloasd",
    count: 0,
  },
  methods: {
    counter(_this, event) {
      _this.data.count++;
      _this.$update();
    },
  },
};
