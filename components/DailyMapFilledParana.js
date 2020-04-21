import React, { Component } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import { Box, Flex } from "@chakra-ui/core";
import notebook from "../from_observablehq/daily_parana_map_filled/index";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-items: center;
  margin: 12px;
`;

export default class App extends Component {
  componentDidMount() {
    new Runtime().module(notebook, (name) => {
      if (name === "viewof confirmed_or_deaths")
        return Inspector.into(
          "#observablehq-cf886714 .observablehq-viewof-confirmed_or_deaths"
        )();
      if (name === "viewof day")
        return Inspector.into(
          "#observablehq-cf886714 .observablehq-viewof-day"
        )();
      if (name === "colorlegend")
        return Inspector.into(
          "#observablehq-cf886714 .observablehq-colorlegend"
        )();
      if (name === "map_spike")
        return Inspector.into(
          "#observablehq-cf886714 .observablehq-map_spike"
        )();
      if (name === "style")
        return Inspector.into("#observablehq-cf886714 .observablehq-style")();
      if (name === "indexSetter")
        return Inspector.into(
          "#observablehq-cf886714 .observablehq-indexSetter"
        )();
    });
  }

  render() {
    return (
      <div className="App">
        <div id="observablehq-cf886714">
          <Container>
            <Flex rounded={8} borderWidth="1px" pl={4} m={4} h={10}
              className="observablehq-viewof-confirmed_or_deaths"
              align="center"
            />
            <Flex
              w={380}
              h={10}
              rounded={8}
              align="center"
              borderWidth="1px" pr={4}
              className="observablehq-viewof-day"
            />
          </Container>
          <div className="observablehq-colorlegend" align="center" />
          <div className="observablehq-map_spike"></div>
          <div className="observablehq-style" style={{ display: "none" }}></div>
          <div
            className="observablehq-indexSetter"
            style={{ display: "none" }}
          ></div>
        </div>
      </div>
    );
  }
}
