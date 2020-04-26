// https://observablehq.com/d/14f5861beb305742@2410
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("sliderDemo")).define("sliderDemo", ["md"], function (md) {
    return (
      md`---
## Sliders

~~~js
import {slider} from "@jashkenas/inputs"
~~~`
    )
  });
  main.variable(observer("viewof a")).define("viewof a", ["slider"], function (slider) {
    return (
      slider()
    )
  });
  main.variable(observer("a")).define("a", ["Generators", "viewof a"], (G, _) => G.input(_));
  main.variable(observer("viewof a1")).define("viewof a1", ["slider"], function (slider) {
    return (
      slider({
        min: 0,
        max: 1,
        step: 0.01,
        format: ".0%",
        description: "Zero to one, formatted as a percentage"
      })
    )
  });
  main.variable(observer("a1")).define("a1", ["Generators", "viewof a1"], (G, _) => G.input(_));
  main.variable(observer("viewof a1_1")).define("viewof a1_1", ["slider"], function (slider) {
    return (
      slider({
        min: 0,
        max: 1,
        step: 0.01,
        format: v => `${Math.round(100 * v)} per cent`,
        description: "Zero to one, formatted with a custom function"
      })
    )
  });
  main.variable(observer("a1_1")).define("a1_1", ["Generators", "viewof a1_1"], (G, _) => G.input(_));
  main.variable(observer("viewof a2")).define("viewof a2", ["slider"], function (slider) {
    return (
      slider({
        min: 0,
        max: 1e9,
        step: 1000,
        value: 3250000,
        format: ",",
        description:
          "Zero to one billion, in steps of one thousand, formatted as a (US) number"
      })
    )
  });
  main.variable(observer("a2")).define("a2", ["Generators", "viewof a2"], (G, _) => G.input(_));
  main.variable(observer("viewof a3")).define("viewof a3", ["slider"], function (slider) {
    return (
      slider({
        min: 0,
        max: 100,
        step: 1,
        value: 10,
        title: "Integers",
        description: "Integers from zero through 100"
      })
    )
  });
  main.variable(observer("a3")).define("a3", ["Generators", "viewof a3"], (G, _) => G.input(_));
  main.variable(observer("viewof a4")).define("viewof a4", ["slider"], function (slider) {
    return (
      slider({
        min: 0.9,
        max: 1.1,
        precision: 3,
        description: "A high precision slider example"
      })
    )
  });
  main.variable(observer("a4")).define("a4", ["Generators", "viewof a4"], (G, _) => G.input(_));
  main.variable(observer("viewof a5")).define("viewof a5", ["slider"], function (slider) {
    return (
      slider({
        min: 0.9,
        max: 1.1,
        precision: 3,
        submit: true,
        description: "The same as a4, but only changes value on submit"
      })
    )
  });
  main.variable(observer("a5")).define("a5", ["Generators", "viewof a5"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], function (md) {
    return (
      md`More [fancy slider techniques](https://beta.observablehq.com/@mootari/prime-numbers-slider).`
    )
  });
  main.variable(observer("slider")).define("slider", ["input"], function (input) {
    return (
      function slider(config = {}) {
        let {
          min = 0, max = 1, value = (max + min) / 2, step = "any", precision = 2,
          title, description, getValue, format, display, submit,
        } = typeof config === "number" ? { value: config } : config;
        precision = Math.pow(10, precision);
        if (!getValue) getValue = input => Math.round(input.valueAsNumber * precision) / precision;
        return input({
          type: "range", title, description, submit, format, display,
          attributes: { min, max, step, value },
          getValue
        });
      }
    )
  });
  main.variable(observer("buttonDemo")).define("buttonDemo", ["md"], function (md) {
    return (
      md`---
## Buttons

~~~js
import {button} from "@jashkenas/inputs"
~~~`
    )
  });
  main.variable(observer("viewof b")).define("viewof b", ["button"], function (button) {
    return (
      button()
    )
  });
  main.variable(observer("b")).define("b", ["Generators", "viewof b"], (G, _) => G.input(_));
  main.variable(observer()).define(["b"], function (b) {
    b
    return !this;
  }
  );
  main.variable(observer("viewof b1")).define("viewof b1", ["button"], function (button) {
    return (
      button({ value: "Click me", description: "We use a reference to the button below to record the time you pressed it." })
    )
  });
  main.variable(observer("b1")).define("b1", ["Generators", "viewof b1"], (G, _) => G.input(_));
  main.variable(observer()).define(["b1"], function (b1) {
    b1;
    return new Date(Date.now()).toUTCString()
  }
  );
  main.variable(observer("button")).define("button", ["input"], function (input) {
    return (
      function button(config = {}) {
        const {
          value = "Ok", title, description, disabled
        } = typeof config === "string" ? { value: config } : config;
        const form = input({
          type: "button", title, description,
          attributes: { disabled, value }
        });
        form.output.remove();
        return form;
      }
    )
  });
  main.variable(observer("radioDemo")).define("radioDemo", ["md"], function (md) {
    return (
      md`---
## Radio Buttons

~~~js
import {radio} from "@jashkenas/inputs"
~~~`
    )
  });
  main.variable(observer("viewof r")).define("viewof r", ["radio"], function (radio) {
    return (
      radio(["Lust", "Gluttony", "Greed", "Sloth", "Wrath", "Envy", "Pride"])
    )
  });
  main.variable(observer("r")).define("r", ["Generators", "viewof r"], (G, _) => G.input(_));
  main.variable(observer("viewof r1")).define("viewof r1", ["radio"], function (radio) {
    return (
      radio({
        title: 'Contact Us',
        description: 'Please select your preferred contact method',
        options: [
          { label: 'By Email', value: 'email' },
          { label: 'By Phone', value: 'phone' },
          { label: 'By Pager', value: 'pager' },
        ],
        value: 'pager'
      })
    )
  });
  main.variable(observer("r1")).define("r1", ["Generators", "viewof r1"], (G, _) => G.input(_));
  main.variable(observer("radio")).define("radio", ["input", "html"], function (input, html) {
    return (
      function radio(config = {}) {
        let {
          value: formValue, title, description, submit, options
        } = Array.isArray(config) ? { options: config } : config;
        options = options.map(o =>
          typeof o === "string" ? { value: o, label: o } : o
        );
        const form = input({
          type: "radio",
          title,
          description,
          submit,
          getValue: input => {
            if (input.checked) return input.value;
            const checked = Array.prototype.find.call(input, radio => radio.checked);
            return checked ? checked.value : undefined;
          },
          form: html`
      <form>
        ${options.map(({ value, label }) => {
            const input = html`<input type=radio name=input ${
              value === formValue ? "checked" : ""
              } style="vertical-align: baseline;" />`;
            input.setAttribute("value", value);
            const tag = html`
          <label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
            return tag;
          })}
      </form>
    `
        });
        form.output.remove();
        return form;
      }
    )
  });
  main.variable(observer("checkboxDemo")).define("checkboxDemo", ["md"], function (md) {
    return (
      md`---
## Checkboxes

~~~js
import {checkbox} from "@jashkenas/inputs"
~~~`
    )
  });
  main.variable(observer("viewof ch")).define("viewof ch", ["checkbox"], function (checkbox) {
    return (
      checkbox(["Lust", "Gluttony", "Greed", "Sloth", "Wrath", "Envy", "Pride"])
    )
  });
  main.variable(observer("ch")).define("ch", ["Generators", "viewof ch"], (G, _) => G.input(_));
  main.variable(observer()).define(["ch"], function (ch) {
    return (
      ch
    )
  });
  main.variable(observer("viewof ch1")).define("viewof ch1", ["checkbox"], function (checkbox) {
    return (
      checkbox({
        title: "Colors",
        description: "Please select your favorite colors",
        options: [
          { value: "r", label: "Red" },
          { value: "o", label: "Orange" },
          { value: "y", label: "Yellow" },
          { value: "g", label: "Green" },
          { value: "b", label: "Blue" },
          { value: "i", label: "Indigo" },
          { value: "v", label: "Violet" }
        ],
        value: ["r", "g", "b"],
        submit: true
      })
    )
  });
  main.variable(observer("ch1")).define("ch1", ["Generators", "viewof ch1"], (G, _) => G.input(_));
  main.variable(observer()).define(["ch1"], function (ch1) {
    return (
      ch1
    )
  });
  main.variable(observer("viewof ch3")).define("viewof ch3", ["checkbox"], function (checkbox) {
    return (
      checkbox({
        description: "Just a single checkbox to toggle",
        options: [{ value: "toggle", label: "On" }],
        value: "toggle"
      })
    )
  });
  main.variable(observer("ch3")).define("ch3", ["Generators", "viewof ch3"], (G, _) => G.input(_));
  main.variable(observer()).define(["ch3"], function (ch3) {
    return (
      ch3
    )
  });
  main.variable(observer("checkbox")).define("checkbox", ["input", "html"], function (input, html) {
    return (
      function checkbox(config = {}) {
        let {
          value: formValue, title, description, submit, options
        } = Array.isArray(config) ? { options: config } : config;
        options = options.map(
          o => (typeof o === "string" ? { value: o, label: o } : o)
        );
        const form = input({
          type: "checkbox",
          title,
          description,
          submit,
          getValue: input => {
            if (input.length)
              return Array.prototype.filter
                .call(input, i => i.checked)
                .map(i => i.value);
            return input.checked ? input.value : false;
          },
          form: html`
      <form>
        ${options.map(({ value, label }) => {
            const input = html`<input type=checkbox name=input ${
              (formValue || []).indexOf(value) > -1 ? "checked" : ""
              } style="vertical-align: baseline;" />`;
            input.setAttribute("value", value);
            const tag = html`<label style="display: inline-block; margin: 5px 10px 3px 0; font-size: 0.85em;">
           ${input}
           ${label}
          </label>`;
            return tag;
          })}
      </form>
    `
        });
        form.output.remove();
        return form;
      }
    )
  });
  main.variable(observer("input")).define("input", ["html", "d3format"], function (html, d3format) {
    return (
      function input(config) {
        let {
          form,
          type = "text",
          attributes = {},
          action,
          getValue,
          title,
          description,
          format,
          display,
          submit,
          options
        } = config;
        const wrapper = html`<div></div>`;
        if (!form)
          form = html`<form>
	<input name=input type=${type} />
  </form>`;
        Object.keys(attributes).forEach(key => {
          const val = attributes[key];
          if (val != null) form.input.setAttribute(key, val);
        });
        if (submit)
          form.append(
            html`<input name=submit type=submit style="margin: 0 0.75em" value="${
              typeof submit == "string" ? submit : "Submit"
              }" />`
          );
        form.append(
          html`<output name=output style="font: 14px Menlo, Consolas, monospace; margin-left: 0.5em;"></output>`
        );
        if (title)
          form.prepend(
            html`<div style="font: 700 0.9rem sans-serif;">${title}</div>`
          );
        if (description)
          form.append(
            html`<div style="font-size: 0.85rem; font-style: italic;">${description}</div>`
          );
        if (format) format = typeof format === "function" ? format : d3format.format(format);
        if (action) {
          action(form);
        } else {
          const verb = submit
            ? "onsubmit"
            : type == "button"
              ? "onclick"
              : type == "checkbox" || type == "radio"
                ? "onchange"
                : "oninput";
          form[verb] = e => {
            e && e.preventDefault();
            const value = getValue ? getValue(form.input) : form.input.value;
            if (form.output) {
              const out = display ? display(value) : format ? format(value) : value;
              if (out instanceof window.Element) {
                while (form.output.hasChildNodes()) {
                  form.output.removeChild(form.output.lastChild);
                }
                form.output.append(out);
              } else {
                form.output.value = out;
              }
            }
            form.value = value;
            if (verb !== "oninput")
              form.dispatchEvent(new CustomEvent("input", { bubbles: true }));
          };
          if (verb !== "oninput")
            wrapper.oninput = e => e && e.stopPropagation() && e.preventDefault();
          if (verb !== "onsubmit") form.onsubmit = e => e && e.preventDefault();
          form[verb]();
        }
        while (form.childNodes.length) {
          wrapper.appendChild(form.childNodes[0]);
        }
        form.append(wrapper);
        return form;
      }
    )
  });
  main.variable(observer("d3format")).define("d3format", ["require"], function (require) {
    return (
      require("d3-format@1")
    )
  });
  return main;
}
