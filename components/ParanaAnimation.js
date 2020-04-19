import React, { Component } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "../pr_info/index";

export default class App extends Component {
  componentDidMount() {
    new Runtime().module(notebook, (name) => {
      if (name === "viewof day")
        return Inspector.into(
          "#observablehq-ca8bc407 .observablehq-viewof-day"
        )();
      if (name === "map")
        return Inspector.into("#observablehq-ca8bc407 .observablehq-map")();
      if (name === "style")
        return Inspector.into("#observablehq-ca8bc407 .observablehq-style")();
      if (name === "draw")
        return Inspector.into("#observablehq-ca8bc407 .observablehq-draw")();
      if (name === "viewof scale")
        return Inspector.into(
          "#observablehq-ca8bc407 .observablehq-viewof-scale"
        )();
      if (name === "indexSetter")
        return Inspector.into(
          "#observablehq-ca8bc407 .observablehq-indexSetter"
        )();
    });
  }

  render() {
    return (
      <div className="App">
        <div id="observablehq-ca8bc407">
          <div className="observablehq-viewof-day" align="center"></div>
          <div className="observablehq-map"></div>
          <div className="observablehq-style"></div>

          <div className="observablehq-draw" style={{ display: "none" }}></div>
          <div
            className="observablehq-viewof-scale"
            style={{ display: "none" }}
          ></div>
          <div
            className="observablehq-indexSetter"
            style={{ display: "none" }}
          ></div>
        </div>
      </div>
    );
  }
}
