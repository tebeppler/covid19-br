import React, { Component } from "react";
import {
  Box,
  Divider,
  Image,
} from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContourParana from "../components/ContourParana";
import ContourBrazil from "../components/ContourBrazil";
import RelatedLinksList from "../components/RelatedLinksList";
import GetCovidDataComp from "../components/GetCovidDataComp";
import { SectionTitleAbout } from "../components/SectionTitle";
import { getCovidCSV } from "../utils/fetcher.ts";

class TestTest extends Component {
  state = { data: null };

  componentDidMount() {
    getCovidCSV().then((d) => this.setState({ data: d }));
  }

  render() {
    const data = this.state["data"];

    if (data === null) {
      return <Box p={6} flex="2" rounded="10px">Didn't load</Box>;
    }

    console.log(data);

    return (
      <Box p={6} flex="2" rounded="10px">
        Loaded!
      </Box>
    );
  }
}

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box size={48}/>
      <GetCovidDataComp>

        <TestTest />
        <TestTest />
        <TestTest />
        <TestTest />

      </GetCovidDataComp>

    </Box>
  );
};
