export default {
  mountPoint: ".temp1",
  template: `
  <h1>Hello {{msg}}</h1>
  <button @click="wdnmd">temp1</button>

    `,
  data: {
    msg: "wdnmd",
  },
  methods: {
    wdnmd(_this) {
      _this.data.msg = "wdnmd" + Math.random();
      _this.$update();
    },
  },
};
