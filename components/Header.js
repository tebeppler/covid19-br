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
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = { light: "white", dark: "gray.800" };
  return (
    <HeaderContainer bg={bg[colorMode]} {...props}>
      <Container h="100%">
        <Flex
          size="100%"
          px={["0", "0", "6"]}
          align="center"
          justify="space-between"
        >
          <Box display="flex" alignItems="center">
            <a href="/">
              <Image
                height="12"
                width="auto"
                objectFit="cover"
                src="/img_logo.png"
                alt="Portal COVID UFPR"
              />
            </a>
          </Box>

          <Flex align="center" color="gray.500">
            <Link mx={marginX} href="/evolution" style={{ textDecoration: "none" }}>
              <Button variant="ghost">Evolução</Button>
            </Link>
            <Link mx={marginX} href="/about" style={{ textDecoration: "none" }}>
              <Button variant="ghost">Sobre</Button>
            </Link>
            {/* <IconButton
              aria-label={`Switch to ${
                colorMode === "light" ? "dark" : "light"
              } mode`}
              variant="ghost"
              ml="2"
              fontSize="20px"
              onClick={toggleColorMode}
              icon={colorMode === "light" ? "moon" : "sun"}
            /> */}
            <Link ml={marginX} href="https://www.ufpr.br/portalufpr/">
              <Image
                height="12"
                width="auto"
                objectFit="cover"
                src="/img_ufpr.png"
                alt="UFPR"
              />
            </Link>
          </Flex>
        </Flex>
      </Container>
    </HeaderContainer>
  );
};

export default Header;
