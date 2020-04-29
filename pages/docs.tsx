import { Box, Divider } from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RelatedLinksList from "../components/RelatedLinksList";
import { SectionTitleAbout } from "../components/SectionTitles";

export default () => {
  return (
    <Box mb={8}>
      <Header />

      <Box maxW="3xl" mx="auto" pt="6rem">
        <SectionTitleAbout>Documentos e Links</SectionTitleAbout>
        <Box size={4} />
        <RelatedLinksList />
      </Box>

      <Box size={24}/>

      <Footer />
    </Box>
  );
};
