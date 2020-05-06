import React, { Component } from "react";
import styled from "@emotion/styled";
import * as d3 from "d3";
import { Box } from "@chakra-ui/core";

// gray.300
const color = "#CBD5E0";

const Styles = styled.div`
  padding: 1rem;
  overflow-x: auto;

  table {
    padding: 1rem;
    border-spacing: 0;
    border: 1px solid ${color};
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    background: white;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid ${color};
      border-right: 1px solid ${color};

      :last-child {
        border-right: 0;
      }
    }
  }
`;

class RelatedLinksList extends Component {
  state = {
    jhuBrCases: 0,
    jhuBrDeaths: 0,
    jhuBrRecovered: 0,
    jhuBrDate: "",
    jhuGlCases: 0,
    jhuGlDeaths: 0,
    jhuGlRecovered: 0,
    brioCases: 0,
    brioDeaths: 0,
    brioDate: "",
  };

  async componentDidMount() {
    const jhuBr = await d3.csv("/current_BR.csv");
    const jhuGl = await d3.csv("/current_GL.csv");
    const brIO = await d3.csv("/caso_shrink.csv");

    const parser = d3.utcParse("%Y-%m-%d");

    const brIOCases = brIO
      .map((d) => +d.confirmed)
      .reduce((total, num) => total + num);
    const brIODeaths = brIO
      .map((d) => +d.deaths)
      .reduce((total, num) => total + num);

    this.setState({
      jhuBrCases: +jhuBr[0]["TotalConfirmed"],
      jhuBrDeaths: +jhuBr[0]["TotalDeaths"],
      jhuBrRecovered: +jhuBr[0]["TotalRecovered"],
      jhuBrDate: parser(
        jhuBr[0]["Date"].slice(0, 10)
      ).toLocaleDateString("pt-br", { month: "long", day: "numeric" }),
      jhuGlCases: +jhuGl[0]["TotalConfirmed"],
      jhuGlDeaths: +jhuGl[0]["TotalDeaths"],
      jhuGlRecovered: +jhuGl[0]["TotalRecovered"],
      brioCases: brIOCases,
      brioDeaths: brIODeaths,
      brioDate: parser(brIO[0]["date"]).toLocaleDateString("pt-br", {
        month: "long",
        day: "numeric",
      }),
    });
  }

  render() {
    return (
      <Styles>
        {/* https://stackoverflow.com/questions/10054870/when-a-child-element-overflows-horizontally-why-is-the-right-padding-of-the-par */}
        <Box display="inline-block">
          <table>
            <thead>
              <tr>
                <th>Dados no Brasil</th>
                <th>Casos</th>
                <th>Mortes</th>
                <th>Recuperados</th>
                <th>Última atualização</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <a href="https://coronavirus.jhu.edu/map.html">
                    John Hopkins
                  </a>
                </th>
                <td>{this.state.jhuBrCases}</td>
                <td>{this.state.jhuBrDeaths}</td>
                <td>{this.state.jhuBrRecovered}</td>
                <td>{this.state.jhuBrDate}</td>
              </tr>
              <tr>
                <th>
                  <a href="https://brasil.io/dataset/covid19/">Brasil.io</a>
                </th>
                <td>{this.state.brioCases}</td>
                <td>{this.state.brioDeaths}</td>
                <td>---</td>
                <td>{this.state.brioDate}</td>
              </tr>
              {/* <tr>
              <th>Outro</th>
              <td>cell2</td>
              <td>cell3</td>
              <td>cell4</td>
            </tr> */}
            </tbody>
          </table>
        </Box>
      </Styles>
    );
  }
}

export default RelatedLinksList;
