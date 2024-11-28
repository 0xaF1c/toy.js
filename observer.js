let channel = [];

export class subject {
  constructor(parameter) {
    this.name = parameter.name;
    this.observers = [];
    this.eventHandler = {
      get() {},
      set() {},
    };

    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      get: (value) => {
        this.call("get", value);
        return this._data;
      },
      set: (newValue) => {
        this.call("set", newValue);
        this._data = newValue;
        this.notify();
      },
    });
    this.data = parameter.data;

    channel.push(this);
  }
  unsubscribing(id) {
    this.observers.splice(id, 1);
    // 重置observerID
    this.observers.forEach((value, index) => {
      value.id = index;
    });
  }
  subscribing(observer) {
    observer.id = this.observers.length;
    this.observers.push(observer);
    this.notify();
  }
  call(method, ...args) {
    return this.eventHandler[method](...args);
  }
  on(method, callback) {
    this.eventHandler[method] = callback;
  }

  notify() {
    console.log("notifyed");
    this.observers.forEach((observer) => {
      observer.update();
    });
  }
}

/**
 * 任何观察者只需要预留update方法
 */
export class observer {
  constructor(subject, callback) {
    this.data = null;
    this.subject = null;
    this.callback = callback;
    this.subscriber(subject);
  }
  subscriber(subject) {
    this.subject = channel.find((value, index) => {
      return subject == value.name;
    });
    if (this.subject != null) {
      this.subject.subscribing(this);
    } else {
      console.error("plz check subject name or subject exists");
    }
  }
  unsubscribe() {
    this.subject.unsubscribing(this.id);
    this.id = null;
    this.data = null;
    this.subject = null;
  }
  update() {
    this.data = this.subject.data;
    if (this.callback) {
      console.log("callback function executing")
      this.callback(this.data);
    }
    console.log("updated")
  }
}