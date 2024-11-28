import { register } from "./lib/register.js"

const counter = () => {
  return {
    name: "my-counter",
    state: {
      count: 0,
      msg: "Hello",
    },
    method: {
      onClick(_this) {
        const { state } = _this;
        state.count++;
        state.msg += state.count;
      },
    },
    template: `
      <button @click="onClick">counter {{ count }}</button>
      <div>{{ msg }}</div>
      `,
    setup(_this) {
      const { state } = _this;
       
      console.log(state);
    },
  };
};

const greet = () => {
  return {
    name: "my-greet",
    state: {
      msg: "Hello!",
    },
    template: `
    <div>{{ msg }}</div>
    <button @click="onClick">greet</button>
    `,
    method: {
      onClick(_this) {
        const { state, dep } = _this;
        state.msg = "Hello! 0xaF1c";
      },
    },
  };
};

// const list = () => {
//   return {
//     name: 'aaa-aaa',
//     state: {
//       msg: `<div>{{ count }}</div>`,
//       count: 0
//     },
//     method: {
//       onClick(_this) {
//         _this.state.count++
//       }
//     },
//     template: `
//       <h1>{{ msg }}</h1>
//       <button @click="onClick"> {{ msg }} {{ count }}</button>
//     `,
//     setup(_this) {
//       console.log(_this.state);
//       window._state = _this.state
//     }
//   }
// }
// register(list)

register(counter)
register(greet)
