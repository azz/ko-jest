import * as ko from "knockout";
import * as fs from "fs";
import { escape } from "lodash";

export function renderDom(template: string, vm: object) {
  document.body.innerHTML = template;
  try {
    ko.cleanNode(document.body);
  } catch (err) {}
  ko.applyBindings(vm, document.body);
}

function stripKnockoutThings(node) {
  for (const child of node.childNodes) {
    if (child.nodeType === Node.COMMENT_NODE) {
      node.removeChild(child);
    }
    if (child.nodeType === Node.ELEMENT_NODE) {
      child.removeAttribute("data-bind");
      stripKnockoutThings(child);
    }
  }
}

export function renderSnapshot(template, vm) {
  renderDom(template, vm);
  stripKnockoutThings(document.body);
  return {
    [Symbol.for("dom")]: document.body,
  }
}

export function getTemplate(path: string) {
  return fs.readFileSync(path).toString();
}

ko.bindingHandlers.debugPrint = {
  update(element, valAccessor) {
    const object = ko.toJS(valAccessor());
    element.setAttribute(
      "data",
      JSON.stringify(object, null, 4)
    );
  },
}
// ko.virtualElements.allowedBindings.debugPrint = true;

export function mockTemplate(templateId: string) {
  const script = document.createElement("script");
  script.type = "text/html";
  script.setAttribute("id", templateId);
  script.innerHTML = `
    <template
      name="${escape(templateId)}"
      data-bind="debugPrint: $data" />
  `;
  document.head.appendChild(script);
  return {
    remove() {
      document.head.removeChild(script);
    }
  }
}
