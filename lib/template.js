import config from "../template.config.js";

class builder {
  constructor(element) {
    this.mountPoint = element;
    this.$root = null;
    this.$temps = [];

    return this;
  }
  components(templates) {
    templates.forEach((temp) => {
      this.component(temp);
    });

    return this;
  }
  component(template) {
    this.$temps.push(template);
    this.update(template);

    return this;
  }
  mount(template) {
    this.$root = template;
    template.mountPoint = this.mountPoint;

    this.update(template);

    return this;
  }
  updateSubTemplates() {
    this.$temps.forEach((temp) => {
      this._update(temp);
    });
  }
  _update(temp) {
    const mountEl = document.querySelector(temp.mountPoint);
    let _this = this;

    let observerList = temp.template.match(/{{.*?.}}/g);

    let result = temp.template;
    if (observerList) {
      observerList.forEach((value) => {
        let key = value.replace("{{", "").replace("}}", "").trim();
        result = result.replace(value, temp.data[key]);
      });
    }

    if (mountEl) {
      mountEl.innerHTML = result;

      mountEl.querySelectorAll("*").forEach((element) => {
        element.getAttributeNames().forEach((attr) => {
          if (attr.match("@")) {
            let eventName = attr.replace("@", "");
            element.addEventListener(eventName, (event) => {
              temp.methods[element.getAttribute(attr)](temp, event);
            });
          }
        });
      });
    }

    temp.$update = () => {
      this.update(temp);
    };
  }
  update(temp) {
    this._update(temp);
    this.updateSubTemplates();
  }
}

class subject {
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
        this.notify();
        this._data = newValue;
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
    this.observers.forEach((observer) => {
      observer.update();
    });
  }
}

/**
 * 任何观察者只需要预留update方法
 */
class observer {
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
      this.callback(this.data);
    }
  }
}

const Template = {
  builder,
  subject,
  observer,
};

export default Template;
