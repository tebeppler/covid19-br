import {
  Box,
  Image,
  Divider,
  Text
} from "@chakra-ui/core";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { SectionTitle, SectionSubtitle } from "../components/SectionTitle";
import StyledFlex from "../components/StyledFlex";

export const TextImageContainer = (props) => (
  <Box maxW="3xl" mx="auto" py="1rem" {...props} />
);

export const Contribution = (props) => (
  <Text fontSize="12px" mx="4px" textAlign="center" {...props} />
);

export const CenteredImage = (props) => (
  <Image mx="auto" {...props} />
);

export default () => {
  return (
    <Box mb={8}>
      <Header />
      <Box size="70px" />

      <TextImageContainer>
        <StyledFlex>
          <Box width={[
            "100%", // base
            "50%", // 480px upwards
          ]}>
            <SectionTitle>Evolução do número de casos e óbitos.</SectionTitle>
            <SectionSubtitle>munícipios</SectionSubtitle>
            <Box size={4} />
            <CenteredImage src="http://covid.c3sl.ufpr.br/figs/brasil-maiscasos.png" />
          </Box>

          <Divider />

          <Box width={[
            "100%", // base
            "50%", // 480px upwards
          ]}>
            <SectionTitle>Taxa de casos por 100mil habitantes.</SectionTitle>
            <SectionSubtitle>munícipios</SectionSubtitle>
            <Box size={4} />
            <CenteredImage src="http://covid.c3sl.ufpr.br/figs/brasil-maiscasos-taxas.png" />
          </Box>
        </StyledFlex>
      </TextImageContainer>

      <Divider />

      <TextImageContainer>
        <SectionTitle>Evolução da taxa de óbitos por casos.</SectionTitle>
        <SectionSubtitle>regiões do Brasil</SectionSubtitle>
        <Box size={4} />
        <CenteredImage src="http://covid.c3sl.ufpr.br/figs/letalidade-regioes.png" alignContent="center" />
      </TextImageContainer>

      <Box bg="black" py="12px">
        <TextImageContainer>
          <SectionTitle color="white">Evolução do número de casos por distâncias.</SectionTitle>
          <SectionSubtitle>estados e regiões do Brasil</SectionSubtitle>
          <Box size={4} />
          <CenteredImage src="http://covid.c3sl.ufpr.br/figs/Covid_Onda_Animada.gif" />
          <Contribution color="white">Contribuição: Prof. Marco Antonio Leonel Caetano (Insper-SP)</Contribution>
        </TextImageContainer>
      </Box>

      <TextImageContainer>
        <SectionTitle>Evolução do número de casos.</SectionTitle>
        <SectionSubtitle>estados e regiões do Brasil</SectionSubtitle>
        <Box size={4} />
        <Image src="http://covid.c3sl.ufpr.br/figs/data-casos-obitos-estado-regiao.png" />
      </TextImageContainer>


      <Box bg="black" pb="8px">
        <TextImageContainer>
          <StyledFlex>
            <Box width={[
              "100%", // base
              "50%", // 480px upwards
            ]}>

              <SectionTitle color="white">Previsão do número casos.</SectionTitle>
              <SectionSubtitle>Brasil (acumulado e diário)</SectionSubtitle>

              <Box size={4} />
              <CenteredImage src="http://covid.c3sl.ufpr.br/figs/Projec_casos_140420.JPG" />

            </Box>

            <Box width={[
              "100%", // base
              "50%", // 480px upwards
            ]}>
              <SectionTitle color="white">Previsão do número de óbitos.</SectionTitle>
              <SectionSubtitle>Brasil (acumulado e diário)</SectionSubtitle>
              <Box size={4} />
              <CenteredImage src="http://covid.c3sl.ufpr.br/figs/Projec_mortes_140420.JPG" />
            </Box>

          </StyledFlex>
          <Contribution color="white" mt="4px">Contribuição: Prof. Marco Antonio Leonel Caetano (Insper-SP)</Contribution>

        </TextImageContainer>


      </Box>

      <TextImageContainer>
        <SectionTitle>Evolução do número de casos e óbitos.</SectionTitle>
        <SectionSubtitle>Brasil e outros países</SectionSubtitle>
        <Box size={4} />
        <CenteredImage src="http://covid.c3sl.ufpr.br/figs/world-country-data.png" />
      </TextImageContainer>

      <Divider />

      <TextImageContainer>
        <SectionTitle>Taxa de óbitos vs número de testes por casos.</SectionTitle>
        <SectionSubtitle>países com 50 óbitos ou mais</SectionSubtitle>
        <Box size={4} />
        <CenteredImage src="http://covid.c3sl.ufpr.br/figs/dispersion-death-tests.png" />
      </TextImageContainer>

      <Footer />

    </Box>
  );
};
