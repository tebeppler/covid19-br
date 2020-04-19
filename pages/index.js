/** @jsx jsx */
import { jsx } from "@emotion/core";

import ParanaAnimation from "../components/ParanaAnimation";
import ParanaContour from "../components/ParanaContour";
import ParanaFilled from "../components/ParanaFilled";
import TopGrowing from "../components/TopGrowing";

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
import Footer from "../components/Footer";
import { DiGithubBadge } from "react-icons/di";
import { MdAccessibility, MdPalette, MdGrain, MdEmail } from "react-icons/md";
import * as Chakra from "@chakra-ui/core";
import NextLink from "next/link";

export const Container = (props) => (
  <Box width="full" maxWidth="1280px" mx="auto" px={6} {...props} />
);

const Feature = ({ title, icon, children, ...props }) => {
  return (
    <Box {...props}>
      <Flex
        rounded="full"
        size={12}
        bg="teal.500"
        align="center"
        justify="center"
      >
        <Box size={6} color="white" as={icon} />
      </Flex>
      <Heading as="h2" size="md" fontWeight="semibold" mt="1em" mb="0.5em">
        {title}
      </Heading>
      <Text>{children}</Text>
    </Box>
  );
};

const FooterLink = ({ icon, href }) => (
  <Link display="inline-block" href={href} isExternal>
    <Box as={icon} size="6" color="gray.400" />
  </Link>
);

export default () => {
  return (
    <Box mb={8}>
      <Header />

      <Box as="section" pt={40} pb={24}>
        <Box d={{ md: "flex" }} alignItems="flex-start">
          <Box p={6} flex="1">
            <Heading as="h1" size="xl" fontWeight="semibold">
              PORTAL COVID-19 no
              <Box as="span" color="teal.500">
                {" "}
                Paraná
              </Box>
              <Box size={4} />
            </Heading>
            <Heading as="h4" size="sm" fontSize={14} fontWeight="normal">
              <p>
                Este portal tem por objetivo agregar informações atualizadas,
                modelos estatísticos, visualizações de dados e links úteis sobre
                a pandemia COVID19 no Brasil, mais especialmente no Estado do
                Paraná.
              </p>
              <Box size={2} />
              <p>
                O conteúdo disponibilizado é um esforço conjunto de
                pesquisadores dos Departamentos de Estatística, Informática,
                Física, Matemática, Design e Saúde da Universidade Federal do
                Paraná e pesquisador do Insper-SP, com o apoio da Direção do
                Setor de Ciências Exatas da UFPR.
              </p>
            </Heading>
          </Box>
          <Box size={8} />
          <Box p={6} flex="2" rounded="10px" borderWidth="1px">
            {" "}
            Resumo Geral
          </Box>
        </Box>
      </Box>

      <Box bg="#f4f4f4" mx="auto" py={4}>
        <Heading as="h6" size="sm" textAlign="center">
          Evolução dos casos
        </Heading>
        <Box size={4} />

        <Box maxW="3xl" mx="auto" textAlign="center">
          <div id="externalDiv">
            <TopGrowing />
          </div>
        </Box>
      </Box>

      <Box maxW="3xl" mx="auto">
        <ParanaFilled />
      </Box>

      <Divider my={8} />

      <Box as="section" pt={40} pb={24}>
        <Container>
          <Box maxW="xl" mx="auto" textAlign="center">
            <Heading as="h1" size="xl" fontWeight="semibold">
              Build accessible React apps & websites
              <Box as="span" color="teal.500">
                {" "}
                with speed
              </Box>
            </Heading>

            <Text opacity="0.7" fontSize="xl" mt="6">
              Chakra UI is a simple, modular and accessible component library
              that gives you all the building blocks you need to build your
              React applications.
            </Text>

            <Box mt="4">
              <NextLink href="/getting-started" passHref>
                <Button size="lg" as="a" variantColor="teal" m={2}>
                  Get Started
                </Button>
              </NextLink>
              <Button
                as="a"
                size="lg"
                m={2}
                href="https://github.com/chakra-ui/chakra-ui/"
                target="__blank"
                leftIcon={(props) => <DiGithubBadge size="1.5em" {...props} />}
              >
                GitHub
              </Button>
            </Box>

            <Flex mt="4" display={["flex", "none"]} justify="center">
              {/* <GitHubButton /> */}
            </Flex>
          </Box>
        </Container>
      </Box>

      <Divider my={16} />

      <Container>
        <Grid
          templateColumns={{ sm: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
          gap={10}
          px={{ md: 12 }}
        >
          <Feature icon={MdAccessibility} title="Accessible">
            Chakra UI strictly follows WAI-ARIA standards. All components come
            with proper attributes and keyboard interactions out of the box.
          </Feature>
          <Feature icon={MdPalette} title="Themeable">
            Quickly and easily reference values from your theme throughout your
            entire application, on any component.
          </Feature>
          <Feature icon={MdGrain} title="Composable">
            Components were built with composition in mind. You can leverage any
            component to create new things.
          </Feature>
        </Grid>
      </Container>

      <Divider my={16} />

      <Container>
        <Box maxW="xl" mx="auto">
          <Heading fontWeight="semibold" textAlign="center" mb="2em">
            Code components for your React Apps with speed{" "}
            <Box as="span" color="teal.500">
              using Chakra
            </Box>
            .
          </Heading>
        </Box>

        <Box></Box>
      </Container>

      <Divider my={16} />
      <Footer />

      <Box as="footer" mt={4} textAlign="center">
        <Text fontSize="xs">
          Developed & Designed by{" "}
          <a href="https://github.com/bernaferrari">Bernardo Ferrari</a> &
          Rafael Ancara
        </Text>
      </Box>
    </Box>
  );
};
