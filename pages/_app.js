import {
  Box,
  ColorModeProvider,
  CSSReset,
  Link,
  Text,
  theme,
  ThemeProvider,
} from "@chakra-ui/core";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";
import seo from "../seo.config";
// import { initGA, logPageView } from "../components/Analytics";

const Main = (props) => <Box as="main" mx="auto" mb="3rem" {...props} />;

const Footer = (props) => (
  <Box textAlign="center" pt="12" pb="4" fontSize="sm" opacity="0.6" {...props}>
    <Text>
      Proudly made in{" "}
      <span aria-label="Nigeria" role="img">
        🇳🇬
      </span>{" "}
    </Text>
    <Text mt="5">Released under the MIT License.</Text>
    <Text>
      Copyright &copy; {new Date().getFullYear()}{" "}
      <Link
        color="teal.500"
        href="https://twitter.com/thesegunadebayo"
        target="__blank"
      >
        Segun Adebayo
      </Link>
    </Text>
  </Box>
);

const HomeLayout = ({ children }) => <Box>{children}</Box>;

export default ({ Component, pageProps }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  let Layout;
  Layout = HomeLayout;

  if (router.pathname === "/") {
    // Layout = HomeLayout;
  } else {
    // Layout = DocsLayout;
  }

  React.useEffect(() => {
    if (!window.GA_INITIALIZED) {
      // initGA();
      window.GA_INITIALIZED = true;
    }
    // logPageView();
  }, []);

  return (
    <ThemeProvider>
      <ColorModeProvider value="light">
        <CSSReset />
        <Layout>
          <DefaultSeo {...seo} />
          <Component {...pageProps} />
        </Layout>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
