import { getCityFromCode } from "./fetcher";
import { DSVRowArray, csv, utcParse, json, values } from "d3";
import { group } from "d3-array";

let cached: Object;
export const loadDataIntoCache = async (): Promise<any> => {
  if (cached) {
    return cached;
  }

  cached = {};
  // fetch in parallel
  await Promise.all([
    getCovidCSV(),
    getCitiesCSV(),
    getMapFrom("br"),
    getMapFrom("pr"),
  ]);

  return cached;
};

const isDeveloping = true;

export const getCovidCSV = async (): Promise<DSVRowArray> => {
  if (cached != null && cached["covid"] != undefined) {
    return cached["covid"];
  }
  cached["covid"] = await csv(
    isDeveloping
      ? "/caso.csv"
      : "https://brasil.io/dataset/covid19/caso?format=csv"
  );
  return cached["covid"];
};

export let cityFromCode: Map<Number, String> = new Map();

export const getCitiesCSV = async (): Promise<DSVRowArray> => {
  if (cached != null && cached["cities"] != undefined) {
    return cached["cities"];
  }
  cached["cities"] = await csv("/municipios.csv");
  cached["cities"].forEach((d) => (cityFromCode[+d.city_ibge_code] = d.city));
  return cached["cities"];
};

export const getMapFrom = async (place: string): Promise<DSVRowArray> => {
  if (cached != null && cached[place] != undefined) {
    return cached[place];
  }
  cached[place] = await json(`/${place}.json`);
  return cached[place];
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

export const getDataCityCovid = async (
  stateNumber: string, // "41"
  stateShortName: string // "PR"
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
      city: d.city,
      latitude: +d["latitude"],
      longitude: +d["longitude"],
      city_ibge_code: +d["city_ibge_code"],
    };
  });

  // date: "2020-04-18"
  // state: "PR"
  // city: "Almirante Tamandaré" <-- removed
  // place_type: "c" <-- replaced "city" with "c"
  // confirmed: 6
  // deaths: 0
  // is_last: "True" <-- removed
  // estimated_population_2019: "118623" <-- removed
  // city_ibge_code: 4100400
  // confirmed_per_100k_inhabitants: "5.05804"
  // death_rate: "" <-- removed
  let rawData = await getCovidCSV();

  let dataFiltered;
  if (stateShortName !== undefined && stateShortName !== null) {
    // select a state
    dataFiltered = rawData.filter(
      (d) =>
        (d.place_type === "c" || d.place_type === "city") &&
        d.city_ibge_code != "" &&
        d.state == stateShortName
    );
  } else {
    // full country
    dataFiltered = rawData.filter(
      (d) =>
        (d.place_type === "c" || d.place_type === "city") &&
        d.city_ibge_code != ""
    );
  }

  const data_covid = dataFiltered.map((d) => ({
    rawDate: d.date,
    state: d.state,
    is_last: d.is_last,
    confirmed: +d.confirmed,
    deaths: +d.deaths,
    city_ibge_code: +d.city_ibge_code,
  }));

  return data_covid.map((d) => {
    let value = data_city.find((e) => d.city_ibge_code === e.city_ibge_code);
    return { ...d, ...value };
  });
};

export const parseDataCityCovid = async (
  currentData: Array<cities>,
  // shouldBacktrack is useless when only most recent data matters
  shouldBacktrack: boolean = true,
  groupedData: Map<string, Array<cities>> = null
): Promise<Array<Array<cities>>> => {
  // sanity check
  let data_city_covid: Array<cities>;
  if (currentData === null || currentData === undefined) {
    data_city_covid = await getDataCityCovid("41", "PR");
  } else {
    data_city_covid = currentData;
  }

  // data
  let data_with_holes =
    groupedData !== undefined && groupedData !== null
      ? groupedData
      : group(data_city_covid, (d) => d.rawDate);

  let mutableArray: Array<Array<cities>> = Array.from(
    [...data_with_holes],
    ([, value]) => value
  )
    .filter((d) => d != null)
    .reverse();

  let keys = [];
  for (let [key] of data_with_holes.entries()) {
    keys.push(key);
  }
  keys = keys.reverse();

  // copy the data forward when nothing was reported
  for (let i = 1; i < keys.length; i++) {
    let values = data_with_holes.get(keys[i]);

    for (let j = 0; j < data_with_holes.get(keys[i - 1]).length; j++) {
      let previousValue = data_with_holes.get(keys[i - 1])[j];

      let found = values.find(
        (d) => d.city_ibge_code === previousValue.city_ibge_code
      );
      if (found !== undefined) {
        continue;
      }

      mutableArray[i].push({ ...previousValue });
    }
  }

  if (shouldBacktrack) {
    // now backtrack to fill the data with zeros
    for (let i = keys.length - 2; i >= 0; i--) {
      let values = data_with_holes.get(keys[i]);

      for (let j = 0; j < data_with_holes.get(keys[i + 1]).length; j++) {
        let nextValue = data_with_holes.get(keys[i + 1])[j];

        let found = values.find(
          (d) => d.city_ibge_code === nextValue.city_ibge_code
        );

        if (found !== undefined) {
          continue;
        }

        let newCase = { ...nextValue };
        newCase.confirmed = 0;
        newCase.deaths = 0;
        newCase.rawDate = values[0].rawDate;
        mutableArray[i].push(newCase);
      }
    }
  }

  return mutableArray.map((e) =>
    e.sort((a, b) => a.city_ibge_code - b.city_ibge_code)
  );
};

export const mostRecentDataForState = async (
  stateNumber: string,
  stateShortName: string
): Promise<Array<cities>> => {
  const city = await getDataCityCovid(stateNumber, stateShortName);
  const all = await parseDataCityCovid(city, false);
  return all[all.length - 1];
};
