const ko = require("knockout");
const { JSDOM } = require("jsdom");
const fs = require("fs");

module.exports = { getTemplate, renderTemplateToDom, renderTemplateToRaw };

function renderTemplateToDom(template, vm) {
  const dom = new JSDOM(`<div id=template>${template}</div>`);
  const div = dom.window.document.querySelector("#template");
  ko.applyBindings(vm, div);
  return { dom: div, window: dom.window };
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

function renderTemplateToRaw(template, vm) {
  const { dom } = renderTemplateToDom(template, vm);
  stripKnockoutThings(dom.parentNode);
  return { [Symbol.for("raw")]: dom.innerHTML };
}

function getTemplate(path) {
  return fs.readFileSync(path);
}
