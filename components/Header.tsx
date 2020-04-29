/** @jsx jsx */
import { Box, Button, Flex, Link } from "@chakra-ui/core";
import { jsx } from "@emotion/core";
import { Container } from "../pages";

const HeaderContainer = (props) => (
  <Box
    pos="fixed"
    as="header"
    top="0"
    zIndex="4"
    left="0"
    right="0"
    borderBottomWidth="1px"
    width="full"
    height="4rem"
    {...props}
  />
);

const marginX = 1;

const Header = (props) => {
  return (
    <HeaderContainer bg="white" {...props}>
      <Container h="100%">
        <Flex
          size="100%"
          px={["0", "0", "6"]}
          align="center"
          justify="space-between"
        >
          <Box display="flex" alignItems="center">
            <a href="/">
              <img height="12" width="96" src="/img_logo.png" alt="Portal" />
            </a>
          </Box>

          <Flex align="center" color="gray.500">
            <Link
              mx={marginX}
              href="/evolution"
              style={{ textDecoration: "none" }}
            >
              <Button variant="ghost">Monitoramento</Button>
            </Link>
            <Link mx={marginX} href="/about" style={{ textDecoration: "none" }}>
              <Button variant="ghost">Links</Button>
            </Link>
            <Link ml={marginX} href="https://www.ufpr.br/portalufpr/">
              <img height="12" width="56" src="/img_ufpr.png" alt="UFPR" />
            </Link>
          </Flex>
        </Flex>
      </Container>
    </HeaderContainer>
  );
};

export default Header;
