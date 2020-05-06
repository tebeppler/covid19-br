import React, { Component } from "react";
import { Box, Flex, Link } from "@chakra-ui/core";
import styled from "@emotion/styled";
import { FaNewspaper, FaInfoCircle, FaFileAlt } from "react-icons/fa";

const StyledP = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const StyledFlex = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  align-items: center;
`;

enum DocumentKind {
  Article,
  Info,
  Document,
}

class RelatedDocument {
  constructor(
    public title: string,
    public kind: DocumentKind,
    public author: string,
    public url: string
  ) {}
}

const DocumentItem = ({ title, kind, children, ...props }) => {
  return (
    <Flex {...props} direction="row">
      <Flex
        rounded="full"
        size={8}
        mx={2}
        my="auto"
        bg={getCorrespondingColor(kind)}
        align="center"
        justify="center"
        flexShrink={0}
      >
        <Box size={4} color="white" as={getCorrespondingIcon(kind)} />
      </Flex>
      <Flex direction="column" my="auto" textAlign="start" minW="0px">
        <StyledP style={{ fontSize: "14px", fontWeight: "bold" }}>
          {title}
        </StyledP>
        <StyledP style={{ fontSize: "12px", fontWeight: "normal" }}>
          {getCorrespondingKindText(kind)} {children !== "" ? "• " : ""}
          {children}
        </StyledP>
      </Flex>
    </Flex>
  );
};

function getCorrespondingKindText(kind: DocumentKind) {
  return kind === DocumentKind.Article
    ? "Artigo"
    : kind === DocumentKind.Info
    ? "Informação"
    : "Documento";
}

function getCorrespondingIcon(kind: DocumentKind) {
  return kind === DocumentKind.Article
    ? FaNewspaper
    : kind === DocumentKind.Info
    ? FaInfoCircle
    : FaFileAlt;
}

function getCorrespondingColor(kind: DocumentKind) {
  return kind === DocumentKind.Article
    ? "#4daf4a"
    : kind === DocumentKind.Info
    ? "#ff7f00"
    : "#999999";
}

class RelatedLinksList extends Component {
  data: Array<RelatedDocument> = [
    new RelatedDocument(
      "Cuidados com análises de dados da Covid19",
      DocumentKind.Info,
      "Bastos, L. (FIOCRUZ), 05/05/2020",
      "http://www.statpop.com.br/2020/05/cuidados-com-analises-de-dados-da.html"
    ),
    new RelatedDocument(
      "Combate ao COVID-19 em cidades menores, o dia D é hoje!",
      DocumentKind.Article,
      "Brugnago, E., Beims, M., 30/04/2020",
      "/docs/CoronaGeral.pdf"
    ),
    new RelatedDocument(
      "Strong correlations between power-law growth of COVID-19 in four continents and the inefficiency of soft quarantine strategies",
      DocumentKind.Article,
      "Manchein, C. et al., CHAOS 30, 041102 (2020)",
      "https://aip.scitation.org/doi/pdf/10.1063/5.0009454?download=true&"
    ),
    new RelatedDocument(
      "Mapa interativo",
      DocumentKind.Info,
      "Dante Aléo/Prof. André Grégio (DInf@UFPR)",
      "https://pinsis.c3sl.ufpr.br/corona-parana"
    ),
    new RelatedDocument(
      "A quem servem os dados?",
      DocumentKind.Article,
      "Sunye, M.S., SBC Horizontes, 2020",
      "http://horizontes.sbc.org.br/index.php/2020/04/15/a-quem-servem-os-dados/"
    ),
    new RelatedDocument(
      "FAKE NEWS sobre o COVID-19!",
      DocumentKind.Info,
      "",
      "https://docs.google.com/document/d/1N6uGC45kdg-hrAk1zsFCYtT89E-5oV5JwxI1eM798kQ/edit"
    ),
    new RelatedDocument(
      "Identificação de modelos para COVID-19…",
      DocumentKind.Article,
      "Caetano, M. A. L. 2020",
      "http://covid.c3sl.ufpr.br/docs/covid19enxameparticulas.pdf"
    ),
    new RelatedDocument(
      "Nota Técnica na SBMAC: Combate ao Coronavírus…",
      DocumentKind.Info,
      "Vasconcelos et al.",
      "https://www.sbmac.org.br/wp-content/uploads/2020/04/Covid-19-Nota-NEW.pdf"
    ),
    new RelatedDocument(
      "Modelling fatality curves of COVID-19…",
      DocumentKind.Article,
      "Vasconcelos et al., 2020",
      "https://www.medrxiv.org/content/10.1101/2020.04.02.20051557v1"
    ),
    new RelatedDocument(
      "Correlação entre crescimento/quarentena do COVID-19",
      DocumentKind.Article,
      "Manchein, Cesar, et al.",
      "http://covid.c3sl.ufpr.br/docs/corrcovid.pdf"
    ),
    new RelatedDocument(
      "Modelagem e Previsões para o COVID19",
      DocumentKind.Document,
      "Marco Antonio Leonel Caetano",
      "http://covid.c3sl.ufpr.br/docs/rascunhocorona.pdf"
    ),
  ];

  render() {
    return (
      <StyledFlex>
        {this.data.map((d) => (
          <Box
            width={[
              "100%", // base
              "50%", // 480px upwards
            ]}
            key={d.url}
          >
            <Box m={1} p={1} rounded={8} borderWidth="1px" bg="white">
              <Link href={d.url} style={{ textDecoration: "none" }}>
                <DocumentItem kind={d.kind} title={d.title}>
                  {d.author}
                </DocumentItem>
              </Link>
            </Box>
          </Box>
        ))}
      </StyledFlex>
    );
  }
}

export default RelatedLinksList;
