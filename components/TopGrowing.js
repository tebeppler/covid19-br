import React, { Component } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import notebook from "../from_observablehq/top_growing/index";

class TopGrowing extends Component {
  componentDidMount() {
    new Runtime().module(notebook, (name) => {
      if (name === "table")
        return Inspector.into("#observablehq-b9b69f31 .observablehq-table")();
      if (name === "confirmedMovingAvg")
        return Inspector.into(
          "#observablehq-b9b69f31 .observablehq-confirmedMovingAvg"
        )();
    });
  }

  render() {
    return (
      <div className="TopGrowing">
        <div id="observablehq-b9b69f31">
          <div className="observablehq-table"></div>
          <div
            className="observablehq-confirmedMovingAvg"
            style={{ display: "none" }}
          ></div>
        </div>
      </div>
    );
  }
}

export default TopGrowing;
