import { Box, Flex, Image, Divider, Text, Button } from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SectionTitleAbout } from "../components/SectionTitles";
import StyledFlex from "../components/StyledFlex";
import RelatedLinksList from "../components/RelatedLinksList";
import OtherSources from "../components/OtherSources";

function AccessOtherSite(props) {
  return (
    <Flex
      width={[
        "100%", // base
        "48%", // 480px upwards
      ]}
      rounded={8}
      bg="#ffffff"
      borderWidth="1px"
      direction="column"
      padding="8px"
      m="1%"
    >
      <a href={props.url}>
        <Flex>
          <Image rounded="4px" size="96px" src={props.src} alt="Preview" />
          <Box pl="8px" width="100%">
            <p
              style={{
                overflow: "hidden",
                width: "90%",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              {props.title}
            </p>
            <Box h="8px" />
            <p
              style={{
                overflow: "hidden",
                width: "90%",
                lineHeight: 1.125,
                minHeight: "2.25em",
              }}
            >
              {props.subtitle}
            </p>
          </Box>
        </Flex>

        <Box h="8px" />
        <Button w="100%">{props.access}</Button>
      </a>
    </Flex>
  );
}

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box size="64px" />

      <Box bg="gray.50">
        <Box maxW="3xl" mx="auto" pt="16px" pb="8px">
          <StyledFlex>
            <AccessOtherSite
              title="Monitoramento do R(t)"
              subtitle="Monitoramento estatístico no Brasil e regiões."
              access="Acessar site"
              src="/wagner_preview.jpg"
              url="http://leg.ufpr.br/~wagner/covid/"
            />
            <AccessOtherSite
              title="Monitoramento geral"
              subtitle="Monitoramento geral no Brasil e regiões"
              access="Acessar site"
              src="/monitoramento_preview.jpg"
              url="https://lineu96.github.io/st/img/proj_covid/covid19.html"
            />
          </StyledFlex>
        </Box>

        <Divider mb={4} borderColor="gray.300" />

        <Box maxW="3xl" mx="auto">
          <SectionTitleAbout>Outras Fontes</SectionTitleAbout>
          <OtherSources />
        </Box>

        <Divider mb={4} borderColor="gray.300" />

        <Box maxW="3xl" mx="auto">
          <SectionTitleAbout>Documentos e Links</SectionTitleAbout>
          <Box size={4} />
          <RelatedLinksList />
        </Box>
      </Box>

      <Box size="16px" />

      <Footer />
    </Box>
  );
};
