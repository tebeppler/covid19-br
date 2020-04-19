// https://observablehq.com/@mbostock/synchronized-views@431
import define1 from "./disposal.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function (md) {
    return md`
# Synchronized Views

[A view](/@mbostock/introduction-to-views) conveniently defines an interactive value.`;
  });
  main
    .variable(observer("viewof x"))
    .define("viewof x", ["html"], function (html) {
      return html`<input type="range" />`;
    });
  main
    .variable(observer("x"))
    .define("x", ["Generators", "viewof x"], (G, _) => G.input(_));
  main.variable(observer()).define(["x"], function (x) {
    return x;
  });
  main.variable(observer()).define(["md"], function (md) {
    return md`
While each interactive value is often independent, other times multiple controls manipulate a shared value. This requires synchronizing views such that interaction with any one view updates both the interactive value and the other views.

One way to synchronize is to treat [views as mutable values](/@mbostock/views-are-mutable-values): make one view the “primary” view, and have the other “secondary” views listen to and mutate the primary view. But sometimes it isn’t obvious which view should be primary.

A more general approach is a _minimal_ view: a container for a mutable value that implements the [EventTarget](https://developer.mozilla.org/docs/Web/API/EventTarget) interface, making it compatible with \`viewof\`. This minimal view also exposes a _view_.value property representing its current value; setting the value causes the view to dispatch an _input_ event, which in turn causes Observable to [rerun](/@mbostock/how-observable-runs) any referencing cells.`;
  });
  main.variable(observer("View")).define("View", ["bind"], function (bind) {
    return class View {
      constructor(value) {
        Object.defineProperties(this, {
          _list: { value: [], writable: true },
          _value: { value, writable: true },
        });
      }
      get value() {
        return this._value;
      }
      set value(value) {
        this._value = value;
        this.dispatchEvent(new CustomEvent("input", { detail: value }));
      }
      addEventListener(type, listener) {
        if (type != "input" || this._list.includes(listener)) return;
        this._list = [listener].concat(this._list);
      }
      removeEventListener(type, listener) {
        if (type != "input") return;
        this._list = this._list.filter((l) => l !== listener);
      }
      dispatchEvent(event) {
        const p = Promise.resolve(event);
        this._list.forEach((l) => p.then(l));
      }
      bind(input, invalidation) {
        return bind(input, this, invalidation);
      }
    };
  });
  main.variable(observer()).define(["md"], function (md) {
    return md`
Now let’s define a minimal view whose initial value is 42:`;
  });
  main
    .variable(observer("viewof y"))
    .define("viewof y", ["View"], function (View) {
      return new View(42);
    });
  main
    .variable(observer("y"))
    .define("y", ["Generators", "viewof y"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function (md) {
    return md`
Here’s our view’s value:`;
  });
  main.variable(observer()).define(["y"], function (y) {
    return y;
  });
  main.variable(observer()).define(["md"], function (md) {
    return md`
And now let’s define an input that both listens to the minimal view and assigns a new value on interaction. Notice that dragging the slider changes the value of _y_.`;
  });
  main.variable(observer()).define(["viewof y", "html"], function ($0, html) {
    return $0.bind(html`<input type="range" min="0" max="100" step="1" />`);
  });
  main.variable(observer()).define(["md"], function (md) {
    return md`
Here are two more inputs (of different types!) bound to the same view. Interacting with either view below updates _y_ as well as the other synchronized inputs above.`;
  });
  main.variable(observer()).define(["viewof y", "html"], function ($0, html) {
    return $0.bind(html`<input type="range" min="0" max="100" step="1" />`);
  });
  main.variable(observer()).define(["viewof y", "html"], function ($0, html) {
    return $0.bind(html`<input type="number" min="0" max="100" step="1" />`);
  });
  main.variable(observer()).define(["y"], function (y) {
    return y;
  });
  main.variable(observer()).define(["md"], function (md) {
    return md`
It works with text, too.`;
  });
  main
    .variable(observer("viewof name"))
    .define("viewof name", ["View"], function (View) {
      return new View("fred");
    });
  main
    .variable(observer("name"))
    .define("name", ["Generators", "viewof name"], (G, _) => G.input(_));
  main
    .variable(observer())
    .define(["viewof name", "html"], function ($0, html) {
      return $0.bind(html`<input type="text" />`);
    });
  main
    .variable(observer())
    .define(["viewof name", "html"], function ($0, html) {
      return $0.bind(html`<input type="text" />`);
    });
  main.variable(observer()).define(["name"], function (name) {
    return name;
  });
  main.variable(observer()).define(["md"], function (md) {
    return md`
---

## Appendix

This implementation uses my [disposal promise](/@mbostock/disposal) to detach bound inputs, rather than requiring you to pass the [invalidation promise](/@observablehq/invalidation) explicitly. The unification of various input types is based on [Generators.input](https://github.com/observablehq/stdlib/blob/master/README.md#Generators_input) from the Observable standard library.`;
  });
  main
    .variable(observer("bind"))
    .define("bind", ["disposal", "eventof", "valueof"], function (
      disposal,
      eventof,
      valueof
    ) {
      return function bind(input, view, invalidation = disposal(input)) {
        input.value = view.value;
        input[`on${eventof(input)}`] = () => (view.value = valueof(input));
        const update = ({ detail: value }) =>
          valueof(input) === value || (input.value = value);
        view.addEventListener("input", update);
        invalidation.then(() => view.removeEventListener("input", update));
        return input;
      };
    });
  main.variable(observer("valueof")).define("valueof", function () {
    return function valueof(input) {
      switch (input.type) {
        case "range":
        case "number":
          return input.valueAsNumber;
        case "date":
          return input.valueAsDate;
        case "checkbox":
          return input.checked;
        case "file":
          return input.multiple ? input.files : input.files[0];
        default:
          return input.value;
      }
    };
  });
  main.variable(observer("eventof")).define("eventof", function () {
    return function eventof(input) {
      switch (input.type) {
        case "button":
        case "submit":
        case "checkbox":
          return "click";
        case "file":
          return "change";
        default:
          return "input";
      }
    };
  });
  const child1 = runtime.module(define1);
  main.import("disposal", child1);
  return main;
}
