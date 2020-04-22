/** @jsx jsx */
import {
  Box,
  Flex,
  Image,
  useColorMode,
  Link,
} from "@chakra-ui/core";
import { jsx } from "@emotion/core";
import styled from "@emotion/styled";

export const FooterContainer = (props) => (
  <Box
    left="0"
    right="0"
    borderTopWidth="1px"
    width="full"
    minH="4rem"
    {...props}
  />
);

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-items: center;
  min-height:"4rem";
`;

const Footer = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = { light: "white", dark: "gray.800" };
  return (
    <FooterContainer bg={bg[colorMode]} {...props}>
      <Box h={2}></Box>
      <Container>
        <a href="https://www.c3sl.ufpr.br/">
          <Image
            height="12"
            width="auto"
            objectFit="cover"
            src="/img_c3sl.png"
            alt="C3SL"
          />
        </a>
        <a href="http://www.exatas.ufpr.br/portal/en/">
          <Image
            height="12"
            width="auto"
            objectFit="cover"
            src="/img_exatas.png"
            alt="Exatas UFPR"
          />
        </a>
        <a href="http://web.leg.ufpr.br/">
          <Image
            height="12"
            width="auto"
            objectFit="cover"
            src="/img_leg.png"
            alt="Laboratório de Estatística e Geoinformação"
          />
        </a>
        <Image
          height="12"
          width="auto"
          objectFit="cover"
          src="/img_labdsi.png"
          alt="Laboratório de Design 
de Sistemas de Informação"
        />

      </Container>
    </FooterContainer>
  );
};

export default Footer;
