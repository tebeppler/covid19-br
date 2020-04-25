
import {
  Box,
  Divider,
} from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContourParana from "../components/ContourParana";
import ContourBrazil from "../components/ContourBrazil";
import RelatedLinksList from "../components/RelatedLinksList";
import { SectionTitleAbout } from "../components/SectionTitle";

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
        <Box as="p" mx="8px" textAlign="center">Se há algo que possamos ajudar, veja o contato dos pesquisadores nos sites dos laboratórios: <Box as="a" color="purple.500" href="https://www.c3sl.ufpr.br">C3SL</Box> e <Box as="a" color="purple.500" href="http://web.leg.ufpr.br/">LEG</Box>!</Box>
      </Box>

      <Divider my={4} />

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

      <Footer />

    </Box>
  );
};
