class Dep {
  constructor() {
    this.subscribers = new Set();
  }

  notify() {
    this.subscribers.forEach((update) => update());
  }

  depend() {
    if (activeAutorun) {
      this.subscribers.add(activeAutorun);
    }
  }
}

let activeAutorun;

function autorun(update) {
  function warppedUpdate() {
    activeAutorun = warppedUpdate;
    update();
    activeAutorun = null;
  }

  warppedUpdate();
}

function observe(state) {
  const dep = new Dep();

  Object.keys(state).forEach((key) => {
    let internalValue = state[key];
    dep.depend();
    Object.defineProperty(state, key, {
      get() {
        return internalValue;
      },
      set(newValue) {
        internalValue = newValue;
        dep.notify();
      },
    });
  });

  return dep;
}
export function watch(state, setter) {
  const dep = observe(state);
  autorun(() => {
    setter(state);
    dep.depend();
  });
}
