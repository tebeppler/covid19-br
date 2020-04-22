/** @jsx jsx */
import { jsx } from "@emotion/core";
import Bona from "../components/DailyMapFilledBona";

import {
  Box,
} from "@chakra-ui/core";
import Header from "../components/Header";

export const Container = (props) => (
  <Box width="full" maxWidth="1280px" mx="auto" px={6} {...props} />
);

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box my={16} />
      <Box>
        <Bona />
      </Box>
    </Box>
  );
};
