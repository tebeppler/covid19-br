/** @jsx jsx */
import {
  Box,
  Button,
  Flex,
  Image,
  IconButton,
  useColorMode,
  Link,
} from "@chakra-ui/core";
import { jsx } from "@emotion/core";
import { Container } from "../pages";

export const FooterContainer = (props) => (
  <Box
    left="0"
    right="0"
    borderTopWidth="1px"
    width="full"
    height="4rem"
    {...props}
  />
);

const Footer = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = { light: "white", dark: "gray.800" };
  return (
    <FooterContainer bg={bg[colorMode]} {...props}>
      <Box h={2}></Box>
      <Container h="100%">
        <Flex
          size="100%"
          px={["0", "0", "6"]}
          align="center"
          justify="space-between"
        >
          <Flex align="center" color="gray.500">
            <Image
              height="12"
              width="auto"
              objectFit="cover"
              src="/img_c3sl.png"
              alt="C3SL"
            />
            <Image
              height="12"
              width="auto"
              objectFit="cover"
              src="/img_exatas.png"
              alt="Exatas UFPR"
            />
            <Image
              height="12"
              width="auto"
              objectFit="cover"
              src="/img_leg.png"
              alt="Laboratório de Estatística e Geoinformação"
            />
            <Image
              height="12"
              width="auto"
              objectFit="cover"
              src="/img_labdsi.png"
              alt="Laboratório de Design 
de Sistemas de Informação"
            />
          </Flex>

          <Box display="flex" alignItems="center">
            <Image
              height="12"
              width="auto"
              objectFit="cover"
              src="/img_ufpr.png"
              alt="UFPR"
            />
          </Box>
        </Flex>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
