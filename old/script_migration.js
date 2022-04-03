/* INIT */
const root = document.querySelector("#root");
const struct = {
  type: "div", // Hello : Function
  attributes: {
    id: "players",
  },
  children: [
    {
      type: "div", // Hello : Function
      attributes: {
        id: "playersList",
      },
    },
    {
      type: "ul", // Hello : Function
      attributes: {
        id: "playersList",
      },
      children: [
        {
          type: "li",
          dataset: {
            position: 1,
          },
          children: ["User1"],
        },
        {
          type: "li", //Hello,
          dataset: {
            position: 2,
          },
          children: ["User2"],
        },
      ],
    },
  ],
};

/* PAGE GENERATION */

// Create link
function link(label, path) {
  return {
    type: "a",
    attributes: {
      href: path,
      onClick: (e) => {
        e.preventDefault();
        history.pushState({ title: label }, label, path);
        root.dispatchEvent(new Event("rerender"));
      },
    },
    children: [label],
  };
}

function Page1() {
  const data = JSON.parse(localStorage.getItem("tableData") ?? "{}");

  const tdClickHandler = (e) => {
    const elem = e.currentTarget;
    const input = document.createElement("input");
    input.value = elem.textContent;
    elem.replaceChild(input, elem.firstChild);
    elem.removeEventListener("click", tdClickHandler);
    input.addEventListener("blur", inputBlurHandler);
  };

  const inputBlurHandler = (e) => {
    const input = e.currentTarget;
    const td = input.parentNode;
    const value = input.value;
    const text = document.createTextNode(value);
    const key = td.dataset.position;
    data[key] = value;
    localStorage.setItem("tableData", JSON.stringify(data));
    input.removeEventListener("blur", inputBlurHandler);
    td.replaceChild(text, input);
    td.addEventListener("click", tdClickHandler);
  };

  return {
    type: "div",
    children: [
      link("Page 2", "/page2"),
      {
        type: "table",
        children: [
          {
            type: "tbody",
            children: new Array(5).fill().map((_, indexRow) => ({
              type: "tr",
              children: new Array(5).fill().map((_, indexCol) => ({
                type: "td",
                dataset: {
                  position: `${indexRow}-${indexCol}`,
                },
                attributes: {
                  onClick: tdClickHandler,
                },
                children: [
                  data[`${indexRow}-${indexCol}`] ??
                  `Cell ${indexRow}-${indexCol}`,
                ],
              })),
            })),
          },
        ],
      },
    ],
  };
}

function Page2() {
  return {
    type: "h1",
    children: ["Page 2", link("Page 1", "/page1")],
  };
}

String.prototype.interpolate = function(attributes) {
  return this;
}

// Root
function generatePage() {
  console.log("history.state");
  console.log(history);

  document.title = history?.state?.title;
  const currentPath = window.location.pathname;
  let elem;
  switch (currentPath) {
    case "/page1":
      elem = Page1();
      break;
    case "/page2":
      elem = Page2();
      break;
    default:
      elem = Page1();
      break;
  }
  if (root.firstChild) {
    root.replaceChild(generateStructure(elem), root.firstChild);
  } else {
    root.appendChild(generateStructure(elem));
  }
}

root.addEventListener("rerender", generatePage);

window.onpopstate = () => root.dispatchEvent(new Event("rerender"));

const generateStructure = (structure) => {
  const node = document.createElement(structure.type);
  if (structure.attributes) {
    for (let attName in structure.attributes) {
      if (/on([A-Z].*)/.test(attName)) {
        const eventName = attName.match(/on([A-Z].*)/)[1].toLowerCase();
        node.addEventListener(eventName, structure.attributes[attName]);
      } else {
        node.setAttribute(attName, structure.attributes[attName]);
      }
    }
  }
  if (structure.dataset) {
    for (let attName in structure.dataset) {
      node.dataset[attName] = structure.dataset[attName];
    }
  }
  if (structure.children)
    for (let child of structure.children) {
      if (child === undefined) continue;
      if (typeof child === "string") {
        node.appendChild(
          document.createTextNode(child.interpolate(structure.attributes))
        );
      } else {
        node.appendChild(generateStructure(child));
      }
    }
  structure.node = node;

  return node;
};

// trigger event render page
root.dispatchEvent(new Event("rerender"));

/* MINI REACT */

const MiniReact = {
  Component: class Component { },
};

class Hello extends MiniReact.Component {
  static propTypes = {
    properties: {
      toWhat: {
        type: "string",
      },
    },
  };
  render() {
    return MiniReact.createElement("div", null, [
      `Hello ${this.props.toWhat}`,
      React.createElement(UserList, { currentUser: this.props.toWhat }),
    ]);
    return {
      type: "div",
      attributes: null,
      children: [`Hello ${this.props.toWhat}`],
    };
  }
}

class UserList extends MiniReact.Component {
  constructor() {
    super();
    this.state.currentUser = this.props.currentUser;
  }
  state = {
    users: [1, 2, 3],
    currentUser: 2,
  };
  render() {
    return MiniReact.createElement(
      "ul",
      null,
      this.state.users.map((user) =>
        user === this.state.currentUser
          ? undefined
          : MiniReact.createElement(
            "li",
            { onClick: () => this.setState({ currentUser: user }) },
            [user]
          )
      )
    );
    return {
      type: "ul",
      attributes: null,
      children: [
        {
          type: "li",
          children: [1],
        },
        undefined,
        {
          type: "li",
          children: [3],
        },
      ],
    };
  }
}

class App extends MiniReact.Component {
  state = {
    users: [1, 2, 3],
  };
  render() {
    return this.state.users.map((user) =>
      MiniReact.createElement(Hello, { toWhat: user })
    );
    // A faire lors de la génération type_check(props, Hello.propTypes)
    return {
      type: Hello,
      props: {
        toWhat: "test",
      },
      children: [],
    };
  }
}