import { Box, Divider, Image, Text } from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContourParana from "../components/d3/ContourParana";
import ContourBrazil from "../components/d3/ContourBrazil";
import GetCovidDataComp from "../components/GetCovidDataComp";
import "../components/d3/Curva_Nivel_Nao_Cumulada_CAMERA_BRASIL"
import {
  SectionTitle,
  SectionSubtitle,
  SectionTitleAbout,
} from "../components/SectionTitles";
import StyledFlex from "../components/StyledFlex";

const TextImageContainer = (props) => (
  <Box maxW="3xl" mx="auto" py="1rem" {...props} />
);

const Contribution = (props) => (
  <Text fontSize="12px" mx="4px" textAlign="center" {...props} />
);

const CenteredImage = (props) => <Image mx="auto" {...props} />;

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

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box size="64px" />

      <Box maxW="xl" mx="auto" mt="16px">
        <SectionTitleAbout>Fale conosco</SectionTitleAbout>
        <Box size={4} />
        <Box as="p" mx="8px" textAlign="center">
          Se há algo que possamos ajudar, veja o contato dos pesquisadores nos
          sites dos laboratórios:{" "}
          <a
            style={{ color: "#9f7aea", fontWeight: "bold" }}
            href="https://www.c3sl.ufpr.br"
          >
            C3SL
          </a>{" "}
          e{" "}
          <a
            style={{ color: "#9f7aea", fontWeight: "bold" }}
            href="http://web.leg.ufpr.br/"
          >
            LEG
          </a>
          !
        </Box>
      </Box>

      <Divider my={4} />

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
        <CenteredImage src="/figs/letalidade-regioes.png" />
      </TextImageContainer>

      <Divider />

      <TextImageContainer>
        <SectionTitle>Evolução do número de casos.</SectionTitle>
        <SectionSubtitle>estados e regiões do Brasil</SectionSubtitle>
        <Box size={4} />
        <CenteredImage src="/figs/data-casos-obitos-estado-regiao.png" />
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
      
            <Divider />

      <TextImageContainer>
        <SectionTitle>Curva de casos.</SectionTitle>
        <SectionSubtitle>estados do Brasil</SectionSubtitle>
        <Box size={4} />
        <CenteredImage src="/figs/animacao_corona.gif" />
      </TextImageContainer>
      

      <Footer />
    </Box>
  );
};
