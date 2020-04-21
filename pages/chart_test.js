/** @jsx jsx */
import { jsx } from "@emotion/core";

import ParanaAnimation from "../components/zDeprecatedParanaInfo";
import ParanaContour from "../components/ContourParana";
import ParanaFilled from "../components/DailyMapFilledParana";
import Brazil from "../components/DailyMapSpikesBrazil";
import TopGrowing from "../components/TopGrowing";
import StatesLines from "../components/DailyLinesBrazil";

import fetch from "isomorphic-unfetch";

import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  Divider,
  Flex,
  Stack,
  Link,
} from "@chakra-ui/core";
import Header from "../components/Header";
import * as Chakra from "@chakra-ui/core";
import NextLink from "next/link";
// import { StreamPlot } from "../components/Stream.tsx";

export const Container = (props) => (
  <Box width="full" maxWidth="1280px" mx="auto" px={6} {...props} />
);

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box my={32} />
      {/* <div
        style={{
          height: 400,
          width: 600
        }}
      >
        <ParanaContour/>
      </div> */}
      {/* <Box maxW="3xl" mx="auto">
        <Brazil />
      </Box> */}
      <Box size={150} />
      <Box maxW="3xl" mx={150}>
        <StatesLines />
      </Box>
    </Box>
  );
};
