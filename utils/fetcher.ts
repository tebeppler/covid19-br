import { DSVRowArray, csv, utcParse } from "d3";
import { group } from "d3-array";

let csvCovid: DSVRowArray = null;

const isDeveloping = false;

export const getCovidCSV = async (): Promise<DSVRowArray> => {
  if (csvCovid) {
    return csvCovid;
  }
  csvCovid = await csv(
    isDeveloping
      ? "/caso.csv"
      : "https://brasil.io/dataset/covid19/caso?format=csv"
  );
  return csvCovid;
};

let csvCities: DSVRowArray = null;

export const getCitiesCSV = async (): Promise<DSVRowArray> => {
  if (csvCities) {
    return csvCities;
  }
  csvCities = await csv("/municipios_mini.csv");
  return csvCities;
};

interface cities {
  latitude: number;
  longitude: number;
  codigo_ibge: number;
  date: Date;
  rawDate: string;
  state: string;
  city: string;
  is_last: string;
  confirmed: number;
  deaths: number;
  city_ibge_code: number;
}

export const dataCityCovid = async (
  stateNumber: string = "41",
  stateShortName: string = "PR"
) => {
  // this will contain a list of objects, where each object is:
  //
  // codigo_ibge: 4100103
  // nome: "Abatiá"
  // latitude: -23.3049
  // longitude: -50.3133
  // capital: "0"
  // codigo_uf: "41"

  const rawCityData = await getCitiesCSV();

  let citiesFiltered;
  if (stateNumber !== undefined && stateNumber !== null) {
    // select a state
    citiesFiltered = rawCityData.filter((d) => d.codigo_uf === stateNumber);
  } else {
    citiesFiltered = rawCityData;
  }

  const data_city = citiesFiltered.map((d) => {
    return {
      latitude: +d["latitude"],
      longitude: +d["longitude"],
      codigo_ibge: +d["codigo_ibge"],
    };
  });

  const parseDate = utcParse("%Y-%m-%d");

  // date: "2020-04-18"
  // state: "PR"
  // city: "Almirante Tamandaré"
  // place_type: "city"
  // confirmed: 6
  // deaths: 0
  // is_last: "True"
  // estimated_population_2019: "118623"
  // city_ibge_code: 4100400
  // confirmed_per_100k_inhabitants: "5.05804"
  // death_rate: ""

  let rawData = await getCovidCSV();

  let dataFiltered;
  if (stateShortName !== undefined && stateShortName !== null) {
    // select a state
    dataFiltered = rawData.filter(
      (d) =>
        d.place_type === "city" &&
        d.city_ibge_code != "" &&
        d.state == stateShortName
    );
  } else {
    // full country
    dataFiltered = rawData.filter(
      (d) => d.place_type === "city" && d.city_ibge_code != ""
    );
  }

  const data_covid = dataFiltered.map((d) => ({
    rawDate: d.date,
    state: d.state,
    city: d.city,
    is_last: d.is_last,
    confirmed: +d.confirmed,
    deaths: +d.deaths,
    city_ibge_code: +d.city_ibge_code,
  }));

  return data_covid.map((d) => {
    let value = data_city.find((e) => d.city_ibge_code === e.codigo_ibge);
    return { ...d, ...value };
  });
};

export const allDataForState = async (
  currentData: Array<cities>,
  // shouldBacktrack is useless when only most recent data matters
  shouldBacktrack: boolean = true
): Promise<Array<Array<cities>>> => {
  // sanity check
  let data_city_covid: Array<cities>;
  if (currentData === null || currentData === undefined) {
    data_city_covid = await dataCityCovid("41", "PR");
  } else {
    data_city_covid = currentData;
  }

  // data
  let data_with_holes = Array.from(
    group(data_city_covid, (d) => d.rawDate),
    ([, value]) => value
  )
    .sort((a, b) => a.date - b.date)
    .reverse();

  let mutableArray: Array<Array<cities>> = [...data_with_holes].filter(
    (d) => d != null
  );

  // copy the data forward when nothing was reported
  for (let i = 1; i < data_with_holes.length; i++) {
    for (let j = 0; j < mutableArray[i - 1].length; j++) {
      let found = mutableArray[i].find(
        (element: { state: string; city: string }) =>
          element.state === mutableArray[i - 1][j].state &&
          element.city === mutableArray[i - 1][j].city
      );
      if (found !== undefined) {
        continue;
      }

      mutableArray[i].push({ ...data_with_holes[i - 1][j] });
    }
  }

  if (shouldBacktrack) {
    // now backtrack to fill the data with zeros
    for (let i = data_with_holes.length - 2; i >= 0; i--) {
      for (let j = 0; j < mutableArray[i + 1].length; j++) {
        let found = mutableArray[i].find(
          (element: { state: string; city: string }) =>
            element.state === mutableArray[i + 1][j].state &&
            element.city === mutableArray[i + 1][j].city
        );
        if (found !== undefined) {
          continue;
        }

        let newCase = { ...data_with_holes[i + 1][j] };
        newCase.confirmed = 0;
        mutableArray[i].push(newCase);
      }

      // trying to sort // moved to the return, else it won't sort the last
      // mutableArray[i] = mutableArray[i].sort((a, b) =>
      //   `${a.state}${a.city}`.localeCompare(`${b.state}${b.city}`)
      // );
    }
  }

  return mutableArray.map((e) =>
    e.sort((a, b) => a.city_ibge_code - b.city_ibge_code)
  );

  // return mutableArray;
};

export const mostRecentDataForState = async (
  stateNumber: string = "41",
  stateShortName: string = "PR"
): Promise<Array<cities>> => {
  const city = await dataCityCovid(stateNumber, stateShortName);
  const all = await allDataForState(city, false);
  return all[all.length - 1];
};
