import { watch } from "./watch.js";

const componentSet = [];
function getComponent(tag) {
  return componentSet.find((component) => {
    return component.name == tag;
  });
}
class customComponent extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  init() {
    this.__CustomElement = true;
    this.setComponent();

    if (this.setup) {
      this.setup(this);
    }

    watch(this.state, () => {
      this.innerHTML = this.template;
      this.renderer();
      const listenerEl = this.getListenerElement();
      this.setEventListener(listenerEl);
    });
  }

  setComponent() {
    const item = getComponent(this.tag);
    const componentData = item.component();

    Object.keys(componentData).forEach((key) => {
      this[key] = componentData[key];
    });
  }

  setEventListener(listeners) {
    listeners.forEach((item) => {
      const { element, attribute, eventName } = item;
      element.addEventListener(eventName, (event) => {
        this.method[attribute](this, event);
      });
    });
  }

  getListenerElement() {
    const eventName = "click";
    const listeners = new Set();

    this.querySelectorAll("*").forEach((element) => {
      element.getAttributeNode

      const attribute = element.getAttribute("@" + eventName);
      if (attribute) {
        listeners.add({ element, attribute, eventName });
      }
    });
    return listeners;
  }

  renderer() {
    const reg = /{{(\S*?)[^}]*}}.*?|}}/g;
    const matchResult = this.template.match(reg);

    matchResult.forEach((str) => {
      const placeholder = str.replace("{{", "").replace("}}", "");
      const key = placeholder.trim();
      this.innerHTML = this.innerHTML.replace(
        `{{${placeholder}}}`,
        this.state[key]
      );
    });
  }
}

function registerComponent(constructor) {
  window.customElements.define(constructor.prototype.tag, constructor);
}

export function register(template) {
  const { name } = template();
  componentSet.push({
    name: name,
    component: template,
  });

  class warppedConstructor extends customComponent {
    constructor() {
      super();
    }
  }

  Object.defineProperty(warppedConstructor, "name", { value: name });
  warppedConstructor.prototype.tag = name;

  registerComponent(warppedConstructor);
}
