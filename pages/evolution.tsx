import { Box, Flex, Image, Divider, Text, Button } from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SectionTitle, SectionSubtitle } from "../components/SectionTitles";
import StyledFlex from "../components/StyledFlex";
import Link from "next";

const TextImageContainer = (props) => (
  <Box maxW="3xl" mx="auto" py="1rem" {...props} />
);

const Contribution = (props) => (
  <Text fontSize="12px" mx="4px" textAlign="center" {...props} />
);

const AdaptiveBox = (props) => (
  <Box
    width={[
      "100%", // base
      "50%", // 480px upwards
    ]}
    py="1rem"
    {...props}
  />
);

function AccessOtherSite(props) {
  return (
    <Flex
      width={[
        "100%", // base
        "48%", // 480px upwards
      ]}
      rounded={8}
      borderWidth="1px"
      direction="column"
      padding="8px"
      m="1%"
    >
      <a href="http://leg.ufpr.br/~wagner/covid/">
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

const CenteredImage = (props) => <Image mx="auto" {...props} />;

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box size="70px" />

      <Box maxW="3xl" mx="auto" py="1rem">
        <StyledFlex>
          <AccessOtherSite
            title="Monitoramento do R(t)"
            subtitle="Monitoramento da pandemia no Brasil e regiões."
            access="Acessar site"
            src="/wagner_preview.jpg"
          />
          <AccessOtherSite
            title="Mapa Interativo"
            subtitle="Situação no Paraná."
            access="Acessar mapa"
            src="/mapa_preview.jpg"
          />
        </StyledFlex>
      </Box>

      <Divider />

      <TextImageContainer>
        <StyledFlex>
          <AdaptiveBox>
            <SectionTitle>Evolução do número de casos e óbitos.</SectionTitle>
            <SectionSubtitle>munícipios</SectionSubtitle>
            <Box size={4} />
            <CenteredImage src="/figs/brasil-maiscasos.png" />
          </AdaptiveBox>

          <AdaptiveBox>
            <SectionTitle>Taxa de casos por 100mil habitantes.</SectionTitle>
            <SectionSubtitle>munícipios</SectionSubtitle>
            <Box size={4} />
            <CenteredImage src="/figs/brasil-maiscasos-taxas.png" />
          </AdaptiveBox>
        </StyledFlex>
      </TextImageContainer>

      <Divider />

      <TextImageContainer>
        <SectionTitle>Evolução da taxa de óbitos por casos.</SectionTitle>
        <SectionSubtitle>regiões do Brasil</SectionSubtitle>
        <Box size={4} />
        <CenteredImage
          src="/figs/letalidade-regioes.png"
          alignContent="center"
        />
      </TextImageContainer>

      <Divider />

      <TextImageContainer>
        <SectionTitle>Evolução do número de casos.</SectionTitle>
        <SectionSubtitle>estados e regiões do Brasil</SectionSubtitle>
        <Box size={4} />
        <Image src="/figs/data-casos-obitos-estado-regiao.png" />
      </TextImageContainer>

      <Box bg="black" pb="8px">
        <TextImageContainer>
          <StyledFlex>
            <AdaptiveBox>
              <SectionTitle color="white">
                Previsão do número casos.
              </SectionTitle>
              <SectionSubtitle>Brasil (acumulado e diário)</SectionSubtitle>
              <Box size={4} />
              <CenteredImage src="/figs/Projec_casos_140420.JPG" />
            </AdaptiveBox>

            <AdaptiveBox>
              <SectionTitle color="white">
                Previsão do número de óbitos.
              </SectionTitle>
              <SectionSubtitle>Brasil (acumulado e diário)</SectionSubtitle>
              <Box size={4} />
              <CenteredImage src="/figs/Projec_mortes_140420.JPG" />
            </AdaptiveBox>
          </StyledFlex>
          <Contribution color="white" mt="4px">
            Contribuição: Prof. Marco Antonio Leonel Caetano (Insper-SP)
          </Contribution>
        </TextImageContainer>
      </Box>

      <TextImageContainer>
        <SectionTitle>Evolução do número de casos e óbitos.</SectionTitle>
        <SectionSubtitle>Brasil e outros países</SectionSubtitle>
        <Box size={4} />
        <CenteredImage src="/figs/world-country-data.png" />
      </TextImageContainer>

      <Divider />

      <TextImageContainer>
        <SectionTitle>
          Taxa de óbitos vs número de testes por casos.
        </SectionTitle>
        <SectionSubtitle>países com 50 óbitos ou mais</SectionSubtitle>
        <Box size={4} />
        <CenteredImage src="/figs/dispersion-death-tests.png" />
      </TextImageContainer>

      <Footer />
    </Box>
  );
};
