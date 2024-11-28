export default {
  mountPoint: ".wdnmd",
  template: `
  <h1>Hello {{msg}}</h1>
  <button @click="wdnmd">wdnmd</button>

  <div class="temp1"></div>
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
