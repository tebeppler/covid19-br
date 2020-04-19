import { DSVRowArray, csv } from "d3";

// export const getCovidJSON = () => d3.csv('https://brasil.io/dataset/covid19/caso?format=csv');

let csvCovid: DSVRowArray = null;

export const getCovidCSV = async (): Promise<DSVRowArray> => {
  if (csvCovid) {
    return csvCovid;
  }
  csvCovid = await csv("/caso.csv"); // https://brasil.io/dataset/covid19/caso?format=csv
  return csvCovid;
};

let csvCities: DSVRowArray = null;

export const getCitiesCSV = async (): Promise<DSVRowArray> => {
  if (csvCities) {
    return csvCities;
  }
  csvCities = await csv("/municipios_mini.csv"); // https://brasil.io/dataset/covid19/caso?format=csv
  return csvCities;
};
