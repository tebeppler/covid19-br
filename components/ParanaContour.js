import React, { Component } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "../pr_heat/index";

class ParanaContour extends Component {
  animationRef = React.createRef();

  componentDidMount() {
    new Runtime().module(notebook, (name) => {
      if (name === "map") return Inspector.into(this.animationRef.current)();
    });
  }

  render() {
    return (
      <div className="ParanaContour">
        <div ref={this.animationRef} />
      </div>
    );
  }
}

export default ParanaContour;
