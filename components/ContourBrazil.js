import React, { Component } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "../from_observablehq/contour_brazil/index";

class ContourBrazil extends Component {
  componentDidMount() {
    (new Runtime).module(notebook, name => {
      if (name === "map") return Inspector.into("#observablehq-c65430d5 .observablehq-map")();
      if (name === "style") return Inspector.into("#observablehq-c65430d5 .observablehq-style")();
    });
  }

  render() {
    return (
      <div id="observablehq-c65430d5">
        <div className="observablehq-map" />
        <div className="observablehq-style" style={{ display: "none" }}></div>
      </div>
    );
  }
}

export default ContourBrazil;
