import React, { Component } from "react";
import { getCovidCSV } from "../utils/fetcher";
import { Box, Stat, StatLabel, StatGroup } from "@chakra-ui/core";
import styled from "@emotion/styled";
import * as d3 from "d3";

const StyledText = styled.p`
  font-family: sans-serif;
  font-size: 2em;
  font-weight: bold;
`;

class OverallInfo extends Component {
  state = { data: null };

  componentDidMount() {
    getCovidCSV().then((d) => this.setState({ data: d }));
  }

  render() {
    const data = this.state["data"];

    if (data === null) {
      return <Box p={6} flex="2" rounded="10px"></Box>;
    }

    const brazil: Array<any> = data.filter((d) => d.state !== undefined);
    const casesBrazil = Math.max(...brazil.map((d) => +d.confirmed));
    const deathsBrazil = Math.max(...brazil.map((d) => +d.deaths));

    const parana = data.filter((d) => d.state === "PR");
    const casesParana = Math.max(...parana.map((d) => +d.confirmed));
    const deathsParana = Math.max(...parana.map((d) => +d.deaths));

    const lastUpdated = brazil[0].date;
    console.log(lastUpdated);
    const parser = d3.utcParse("%Y-%m-%d");
    const date = parser(lastUpdated);

    return (
      <Box p={6} flex="2" rounded="10px">
        <StatGroup rounded="8px" borderWidth="1px" p={4} mt={2}>
          <Stat>
            <StatLabel>Casos no Brasil</StatLabel>
            <StyledText style={{ color: "#ff9500" }}>{casesBrazil}</StyledText>
          </Stat>

          <Stat>
            <StatLabel>Óbitos no Brasil</StatLabel>
            <StyledText style={{ color: "#c9166a" }}>{deathsBrazil}</StyledText>
          </Stat>
        </StatGroup>
        <StatGroup rounded="8px" borderWidth="1px" p={4} mt={2}>
          <Stat>
            <StatLabel>Casos no Paraná</StatLabel>
            <StyledText style={{ color: "#ff9500" }}>{casesParana}</StyledText>
          </Stat>

          <Stat>
            <StatLabel>Óbitos no Paraná</StatLabel>
            <StyledText style={{ color: "#c9166a" }}>{deathsParana}</StyledText>
          </Stat>
        </StatGroup>
        <StatLabel pt={2} style={{ textAlign: "center" }}>
          última atualização: {date.toLocaleDateString("pt-BR")}
        </StatLabel>
      </Box>
    );
  }
}

export default OverallInfo;
