import { Box, Image, Divider, Text } from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SectionTitle, SectionSubtitle } from "../components/SectionTitles";
import StyledFlex from "../components/StyledFlex";

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

const CenteredImage = (props) => <Image mx="auto" {...props} />;

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box size="70px" />

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
