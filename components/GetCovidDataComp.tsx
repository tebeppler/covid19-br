import React, { Component, Fragment } from "react";
import { loadDataIntoCache } from "../utils/fetcher";
import { Box, Flex, Spinner, Text } from "@chakra-ui/core";

class GetCovidDataComp extends Component {
  state = { data: null };

  componentDidMount() {
    loadDataIntoCache().then((d) => this.setState({ data: d }));
  }

  render() {
    const data = this.state["data"];

    if (data === null) {
      return (
        <Flex w="100%" minH="512px" rounded="10px">
          <Flex mx="auto" my="auto" direction="column">
            <Spinner
              size="xl"
              speed="1s"
              mx="auto"
              thickness="2px"
              color="purple.500"
            />
            <Box size="16px" />
            <Text fontSize="sm">carregando os dados...</Text>
          </Flex>
        </Flex>
      );
    }

    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default GetCovidDataComp;
