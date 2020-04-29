import React, { Component } from "react";
import { Runtime, Inspector } from "@observablehq/runtime";
import { Flex, Box } from "@chakra-ui/core";
import notebook from "../../from_observablehq/daily_lines/index";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-items: center;
`;

export default class Map extends Component {
  componentDidMount() {
    (new Runtime).module(notebook, name => {
      if (name === "viewof indicator") return Inspector.into("#observablehq-65e7d81f .observablehq-viewof-indicator")();
      if (name === "chart") return Inspector.into("#observablehq-65e7d81f .observablehq-chart")();
    });
  }

  render() {
    return (
      <div className="Map">
        <div id="observablehq-65e7d81f">
          <Container>
            <Flex rounded={8} borderWidth="1px" pl={4} m={2} minH={10}
              className="observablehq-viewof-indicator"
              align="center"
              alignContent="center"
            />
          </Container>

          <Box h={400} id="externalDivForDaily" className="observablehq-chart" />
        </div>
      </div>
    );
  }
}
