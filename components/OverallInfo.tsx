import React from "react";
import { getCovidCSV } from "../utils/fetcher";
import { Box, Stat, StatLabel, StatGroup } from "@chakra-ui/core";
import styled from "@emotion/styled";
import * as d3 from "d3";

const StyledText = styled.p`
  font-family: sans-serif;
  font-size: 2em;
  font-weight: bold;
`;

class OverallInfo extends React.Component {
  state = { data: null };

  componentDidMount() {
    d3.csv("/caso_shrink.csv").then((d) => this.setState({ data: d }));
  }

  render() {
    const data = this.state["data"];

    if (data === null) {
      return (
        <Box p={6} flex="1" rounded="10px">
        </Box>
      );
    }

    const brazil = data;
    // const brazil: Array<any> = data.filter(
    //   (d) =>
    //     (d.place_type === "s" || d.place_type === "state") &&
    //     d.is_last === "True"
    // );

    const casesBrazil = brazil
      .map((d) => +d.confirmed)
      .reduce((total, num) => total + num);
    const deathsBrazil = brazil
      .map((d) => +d.deaths)
      .reduce((total, num) => total + num);

    // efficient, instead of re-filtering the full list
    const parana = brazil.filter((d) => d.state === "PR");
    const casesParana = parana[0].confirmed;
    const deathsParana = parana[0].deaths;

    const lastUpdated = brazil[0].date;
    const parser = d3.timeParse("%Y-%m-%d");
    const date = parser(lastUpdated);

    return (
      <Box p={6} flex="1" rounded="10px">
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
          <a href="https://brasil.io/dataset/covid19/">
            última atualização: {date.toLocaleDateString("pt-BR")} (fonte)
          </a>
        </StatLabel>
      </Box>
    );
  }
}

export default OverallInfo;
