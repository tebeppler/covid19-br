/** @jsx jsx */
import { jsx } from "@emotion/core";

import ParanaFilledInteractive from "../components/DailyMapFilledParana";
import TopGrowing from "../components/TopGrowing";
import BrazilInteractive from "../components/DailyMapSpikesBrazil";
import StatesLines from "../components/DailyLinesBrazil";
import OverallInfo from "../components/OverallInfo.tsx";
import GetCovidDataComp from "../components/GetCovidDataComp";

import {
  Box,
  Heading,
  Text,
  Divider,
  Link,
} from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const Container = (props) => (
  <Box width="full" maxWidth="1280px" mx="auto" px={6} {...props} />
);

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <GetCovidDataComp>

        <Box mx="auto" maxW="3xl" pt={40} pb={16}>
          <Box d={{ md: "flex" }} alignItems="flex-start">
            <Box p={6} flex="2">
              <Heading as="h1" size="xl" fontWeight="semibold">
                Portal COVID-19 no
              <Box as="span" color="purple.500">
                  {" "}
                Paraná
              </Box>
                <Box size={4} />
              </Heading>
              <Heading as="h4" size="sm" fontSize={12} fontWeight="normal">
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
            <OverallInfo />
          </Box>
        </Box>

        <Box bg="#f4f4f4" mx="auto" py={4}>
          <Heading size="sm" textAlign="center">
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
          <ParanaFilledInteractive />
        </Box>

        <Divider mt={4} />

        <Box maxW="3xl" mx="auto">
          <BrazilInteractive />
        </Box>

        <Divider mt={4} />

        <Box maxW="3xl" mx="auto">
          <StatesLines />
        </Box>

      </GetCovidDataComp>

      <Footer />

    </Box>
  );
};
