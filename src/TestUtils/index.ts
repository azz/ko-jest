const ko = require("knockout");
const fs = require("fs");

export function renderDom(template, vm) {
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

export function getTemplate(path) {
  return fs.readFileSync(path);
}
