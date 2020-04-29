import { Box, Divider, Image } from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContourParana from "../components/d3/ContourParana";
import ContourBrazil from "../components/d3/ContourBrazil";
import RelatedLinksList from "../components/RelatedLinksList";
import { SectionTitleAbout } from "../components/SectionTitles";
import GetCovidDataComp from "../components/GetCovidDataComp";

export default () => {
  return (
    <Box mb={8}>
      <Header />

      <Box maxW="3xl" mx="auto" pt="6rem">
        <SectionTitleAbout>Links e Documentos</SectionTitleAbout>
        <Box size={4} />
        <RelatedLinksList />
      </Box>

      <Divider my={4} />

      <Box maxW="xl" mx="auto">
        <SectionTitleAbout>Fale conosco</SectionTitleAbout>
        <Box size={4} />
        <Box as="p" mx="8px" textAlign="center">
          Se há algo que possamos ajudar, veja o contato dos pesquisadores nos
          sites dos laboratórios:{" "}
          <a style={{ color: "#9f7aea" }} href="https://www.c3sl.ufpr.br">
            C3SL
          </a>{" "}
          e{" "}
          <a style={{ color: "#9f7aea" }} href="http://web.leg.ufpr.br/">
            LEG
          </a>
          !
        </Box>
      </Box>

      <Divider my={4} />

      <Box maxW="3xl" mx="auto">
        <a href="https://pinsis.c3sl.ufpr.br/corona-parana">
          <Image
            maxW="350px"
            maxH="350px"
            mx="auto"
            src="/mapainterativo.jpg"
          />
        </a>
      </Box>

      <Divider my={4} />

      <GetCovidDataComp>
        <Box maxW="3xl" mx="auto">
          <SectionTitleAbout>Casos no Brasil</SectionTitleAbout>
          <Box size={4} />
          <ContourBrazil />
        </Box>

        <Divider my={4} />

        <Box maxW="3xl" mx="auto">
          <SectionTitleAbout>Casos no Paraná</SectionTitleAbout>
          <Box size={4} />
          <ContourParana />
        </Box>
      </GetCovidDataComp>

      <Footer />
    </Box>
  );
};
