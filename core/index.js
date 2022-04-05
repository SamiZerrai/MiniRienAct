import Component from "./component.js";
import { prop_access, type_check, type_check_v1 } from "./utils.js";

export const MiniReact = {
  Component: Component,

  render: (componentClass, domElement, properties = {}) => {
    console.log("render call");
    let prevChild = null;
    const component = new componentClass(properties);
    prevChild = component.display();

    // TODO : Renseinger la nouvelle did update dans le composant plus tard

    domElement.appendChild(prevChild);
  },

  createElement: (element, properties, childrens) => {
    if (element.isClass()) {
      const component = new element(properties);
      return component.render();
    } else {
      const node = document.createElement(element);

        if(childrens) {

            if (!type_check_v1(childrens, 'array')) {

                let child = childrens;
                    console.log("child");
                    console.log(child);
                    if (typeof child === "string") {
                        if (properties) node.appendChild(document.createTextNode(child.interpolate(properties)));
                        else node.appendChild(document.createTextNode(child));

                    } else {
                        node.appendChild(child);
                    }

            }else {
                childrens.forEach(child => {
                    console.log("child");
                    console.log(child);
                    //   if (child === undefined) continue;

                    if (typeof child === "string") {
                        node.appendChild(document.createTextNode(child.interpolate(properties)));
                    } else {
                        node.appendChild(child);
                    }
                });
            }
      }

      if (properties) {
        Object.keys(properties).forEach((propertyName) => {
          if (/on([A-Z].*)/.test(propertyName)) {
            const eventName = propertyName.match(/on([A-Z].*)/)[1].toLowerCase();
            node.addEventListener(eventName, properties[propertyName]);
          } else {
            node.setAttribute(propertyName, properties[propertyName]);
          }
        });
      }

      return node;
    }
  },
};