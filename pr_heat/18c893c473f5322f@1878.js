// https://observablehq.com/@bernaferrari/parana-contour-cases-map-covid-19@1878
import define1 from "./scrubber.js";
import define2 from "./3df1b33bb2cfcd3c@431.js";
import * as topojson from "topojson-client";
import * as d3 from "d3";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md", "dates"], function (md, dates) {
    return md`# Paraná Contour Cases Map (COVID-19)

Dados entre: ${dates[0].toLocaleDateString()} e ${dates[dates.length - 1].toLocaleDateString()}.

*Fonte: [covid19-br](https://brasil.io/api/dataset/covid19)*`;
  });
  main
    .variable(observer("map"))
    .define(
      "map",
      [
        "d3",
        "w",
        "h",
        "statesOuter",
        "path",
        "contours",
        "thresholdColorScale",
        "statesInner",
        "html",
      ],
      function (
        d3,
        w,
        h,
        statesOuter,
        path,
        contours,
        thresholdColorScale,
        statesInner,
        html
      ) {
        const svg = d3
          .create("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("viewBox", [0, 0, w, h]);

        svg
          .append("path")
          .datum(statesOuter)
          .attr("class", "outer")
          .attr("d", path)
          .attr("id", "usPath")
          .style("fill", "white")
          .attr("stroke", "#999")
          .attr("stroke-width", "0.5px");

        svg
          .append("clipPath")
          .attr("id", "usClipPath")
          .append("use")
          .attr("xlink:href", "#usPath");

        const g = svg
          .append("g")
          .selectAll(".contour")
          .data(contours)
          .join("g");

        g.append("path")
          .attr("clip-path", "url(#usClipPath)")
          .attr("class", (d) => `contour ${d.value}`)
          .attr("d", d3.geoPath())
          // .attr("stroke-width", (d, i) => i % 5 ? 0.25 : 1)
          // .style("stroke", "white")
          .attr("fill", (d) => thresholdColorScale(d.value));

        svg
          .append("path")
          .datum(statesInner)
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", "0.5px")
          .attr("stroke-linejoin", "round")
          .attr("d", path);

        const wrapper = html`<div class="wrapper"></div>`;
        wrapper.append(svg.node());
        return wrapper;
      }
    );
  main
    .variable(observer("climateFeatures"))
    .define("climateFeatures", ["topojson", "brasil"], function (
      topojson,
      brasil
    ) {
      return topojson.feature(brasil, brasil.objects["41"]).features;
    });
  main
    .variable(observer("climateVoronoi"))
    .define("climateVoronoi", ["d3", "climateFeatures"], function (
      d3,
      climateFeatures
    ) {
      return d3.geoVoronoi({
        type: "FeatureCollection",
        features: climateFeatures,
      });
    });
  main
    .variable(observer("rawPoints"))
    .define("rawPoints", ["d3"], function (d3) {
      const lats = d3.range(-26.804461, -22.359125, 0.25);

      // range latitudes from -130 (W) to -60 (E) for every 1 degree
      const lons = d3.range(-54.666145, -48.201728, 0.25);

      // long / lat points in order from west to east, then north to south, like a wrap
      return lons.map((lon, i) => lats.map((lat) => [lon, lat])).flat();
    });
  main.variable(observer("between")).define("between", function () {
    return function between(num, a, b) {
      var min = Math.min(a, b),
        max = Math.max(a, b);
      return num >= min && num <= max;
    };
  });
  main
    .variable(observer("filtered_raw_pointer"))
    .define(
      "filtered_raw_pointer",
      ["rawPoints", "recentData", "between"],
      function (rawPoints, recentData, between) {
        return rawPoints.map((d) => {
          const results = recentData.filter(
            (dd) =>
              between(dd["longitude"], d[0] - 0.25, d[0] + 0.25) &&
              between(dd["latitude"], d[1] - 0.25, d[1] + 0.25)
          );

          if (results.length === 0) {
            return 0;
          } else {
            return results.reduce((acc, data) => acc + data.confirmed, 0);
          }
        });
      }
    );
  main
    .variable(observer("voronoiLookup"))
    .define("voronoiLookup", ["filtered_raw_pointer"], function (
      filtered_raw_pointer
    ) {
      return new Map(filtered_raw_pointer.map((d, i) => [i, d]));
    });
  main
    .variable(observer("maxValue"))
    .define("maxValue", ["filtered_raw_pointer"], function (
      filtered_raw_pointer
    ) {
      return Math.max.apply(Math, filtered_raw_pointer);
    });
  main
    .variable(observer("contour"))
    .define("contour", ["d3", "w", "h"], function (d3, w, h) {
      return d3
        .contourDensity()
        .x((d) => d[0])
        .y((d) => d[1])
        .size([w, h])
        .cellSize(2)
        .thresholds(12);
    });
  main
    .variable(observer("geojson"))
    .define("geojson", ["rawPoints"], function (rawPoints) {
      return rawPoints.map((d, i) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: d,
          },
          properties: {
            index: i,
          },
        };
      });
    });
  main
    .variable(observer("gridPoints"))
    .define(
      "gridPoints",
      ["rawPoints", "projection", "get_point_data"],
      function (rawPoints, projection, get_point_data) {
        return rawPoints
          .map((point, i) => ({
            centroid: projection(point),
            data: get_point_data(point, i),
          }))
          .filter((d) => d.centroid !== null && d.data !== null);
      }
    );
  main
    .variable(observer("newscale"))
    .define("newscale", ["d3", "temp_values_domain"], function (
      d3,
      temp_values_domain
    ) {
      return d3.scaleSymlog().domain(temp_values_domain).range([0, 1]);
    });
  main
    .variable(observer("contour_data"))
    .define("contour_data", ["gridPoints"], function (gridPoints) {
      return gridPoints.reduce((acc, data) => {
        // calculate the number of points based on the temp change value, down to 0.1.
        const num_points = Math.ceil(Math.sqrt(Math.abs(data.data)));

        // create an array of that same value repeated to create stacked points tied to the data value
        const array = new Array(num_points).fill(data.centroid, 0, num_points);

        return [...acc, ...array];
      }, []);
    });
  main
    .variable(observer("contours"))
    .define("contours", ["contour", "contour_data"], function (
      contour,
      contour_data
    ) {
      return contour(contour_data);
    });
  main.variable(observer("colors")).define("colors", function () {
    return [
      "#023858",
      "#045a8d",
      "#0570b0",
      "#3690c0",
      "#74a9cf",
      "#a6bddb",
      "#d0d1e6",
      "#fff",
      "#fed976",
      "#feb24c",
      "#fd8d3c",
      "#fc4e2a",
      "#e31a1c",
      "#bd0026",
      "#800026",
    ];
  });
  main
    .variable(observer("density_thresholds"))
    .define("density_thresholds", ["contours"], function (contours) {
      return contours.map((d) => +d.value);
    });
  main
    .variable(observer("zero_estimation_index"))
    .define("zero_estimation_index", function () {
      return 0;
    });
  main
    .variable(observer("quantz"))
    .define(
      "quantz",
      ["d3", "linearColorScale", "density_thresholds", "zero_estimation_index"],
      function (
        d3,
        linearColorScale,
        density_thresholds,
        zero_estimation_index
      ) {
        return d3.quantize(
          linearColorScale,
          (density_thresholds.length - zero_estimation_index) * 2
        );
      }
    );
  main
    .variable(observer("thresholdColorScale"))
    .define(
      "thresholdColorScale",
      ["d3", "density_thresholds", "quantz", "threshold_index_domain"],
      function (d3, density_thresholds, quantz, threshold_index_domain) {
        return d3
          .scaleOrdinal()
          .domain(density_thresholds)
          .range(quantz.slice(-threshold_index_domain.length));
      }
    );
  main
    .variable(observer("threshold_index_domain"))
    .define(
      "threshold_index_domain",
      ["d3", "zero_estimation_index", "density_thresholds"],
      function (d3, zero_estimation_index, density_thresholds) {
        return d3.range(
          -zero_estimation_index,
          density_thresholds.length - zero_estimation_index,
          1
        );
      }
    );
  main
    .variable(observer("linearColorScale"))
    .define("linearColorScale", ["d3", "colors"], function (d3, colors) {
      return d3
        .scaleLinear()
        .domain(d3.range(0, 1, 1 / colors.length))
        .range(colors)
        .interpolate(d3.interpolateLab);
    });
  main
    .variable(observer("temp_values_domain"))
    .define("temp_values_domain", ["maxValue"], function (maxValue) {
      return [0, maxValue];
    });
  main
    .variable(observer("statesOuter"))
    .define("statesOuter", ["topojson", "brasil"], function (topojson, brasil) {
      return topojson.mesh(brasil, brasil.objects["41"], (a, b) => a === b);
    });
  main
    .variable(observer("statesInner"))
    .define("statesInner", ["topojson", "brasil"], function (topojson, brasil) {
      return topojson.mesh(brasil, brasil.objects["41"], (a, b) => a !== b);
    });
  main
    .variable(observer("get_point_data"))
    .define("get_point_data", ["d3", "estado", "voronoiLookup"], function (
      d3,
      estado,
      voronoiLookup
    ) {
      return (d, i) => {
        let data = null;

        // this limits the data to the regions in or close to the US.
        if (d3.geoContains(estado, d)) {
          let voronoi = voronoiLookup.get(i);
          data = voronoi;
        }

        return data;
      };
    });
  main
    .variable(observer("map3"))
    .define(
      "map3",
      [
        "d3",
        "w",
        "h",
        "estado",
        "path",
        "temp_values_domain",
        "contours",
        "geojson",
        "get_point_data",
        "linearColorScale",
        "html",
      ],
      function (
        d3,
        w,
        h,
        estado,
        path,
        temp_values_domain,
        contours,
        geojson,
        get_point_data,
        linearColorScale,
        html
      ) {
        const svg = d3
          .create("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("viewBox", [0, 0, w, h])
          .attr("class", "italy");

        svg
          .selectAll(".subunit")
          .data(estado.features)
          .enter()
          .append("path")
          .attr("class", function (d) {
            return "subunit";
          })
          .attr("d", path);

        let pointScale = d3
          .scaleSymlog()
          .domain(temp_values_domain)
          .range([0, 1]);

        const g = svg
          .append("g")
          .selectAll(".contour")
          .data(contours)
          .join("g");

        svg
          .selectAll(".point")
          .data(geojson)
          .enter()
          .append("path")
          .attr("d", path)
          .style("stroke", "#000")
          .style("stroke-width", 0.1)
          .style("fill", (d, i) => {
            const value = get_point_data(d.geometry.coordinates, i);
            // if the point isn't within our bounds, don't color it
            if (value === null) return "none";
            // otherwise, fill with the colorScale (but first, convert to [0,1] through a pointScale)
            return linearColorScale(pointScale(value));
          });

        const wrapper = html`<div class="wrapper"></div>`;
        wrapper.append(svg.node());
        return wrapper;
      }
    );
  main.variable(observer()).define(["html"], function (html) {
    const c = `rgb(255, 255, 255, 0.5)`;
    return html`<style>
      .wrapper {
        text-align: center;
      }
      .subunit {
        fill: none;
        stroke: #999;
        stroke-width: 0.5px;
      }
      .inner {
        fill: none;
        stroke: #fff;
        stroke-width: 0.5px;
      }
      .outer {
        fill: none;
        stroke: #999;
        stroke-width: 0.5px;
      }
      .point {
        stroke: #ccc;
        stroke-width: 0.5px;
        fill: none;
      }
    </style>`;
  });
  main
    .variable(observer("projection"))
    .define("projection", ["d3", "w", "h", "estado"], function (
      d3,
      w,
      h,
      estado
    ) {
      return d3.geoMercator().fitExtent(
        [
          [0, 0],
          [w, h],
        ],
        estado
      );
    });
  main.variable(observer("w")).define("w", ["width"], function (width) {
    return Math.min(width, 700);
  });
  main.variable(observer("h")).define("h", function () {
    return 500;
  });
  main
    .variable(observer("data"))
    .define("data", ["d3array", "data_city_covid"], function (
      d3array,
      data_city_covid
    ) {
      let data_with_holes = Array.from(
        d3array.group(data_city_covid, (d) => d.date)
      )
        .map((d) => d[1])
        .sort((a, b) => a.date - b.date)
        .reverse();

      let mutableArray = [...data_with_holes].filter(function (el) {
        return el != null;
      });

      for (let i = 1; i < data_with_holes.length; i++) {
        for (let j = 0; j < mutableArray[i - 1].length; j++) {
          let found = mutableArray[i].find(
            (element) =>
              element.state === mutableArray[i - 1][j].state &&
              element.city === mutableArray[i - 1][j].city
          );
          if (found !== undefined) {
            continue;
          }

          mutableArray[i].push({ ...data_with_holes[i - 1][j] });
        }
      }

      // this can also be commented, transition will still be buggy
      //   now backtrack to fill the data with zeros
      for (let i = data_with_holes.length - 2; i >= 0; i--) {
        for (let j = 0; j < mutableArray[i + 1].length; j++) {
          let found = mutableArray[i].find(
            (element) =>
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

        // trying to sort
        mutableArray[i] = mutableArray[i].sort((a, b) =>
          `${a.state}${a.city}`.localeCompare(`${b.state}${b.city}`)
        );
      }

      return mutableArray;
    });
  main
    .variable(observer("data_city_covid"))
    .define("data_city_covid", ["data_covid", "data_city"], function (
      data_covid,
      data_city
    ) {
      return data_covid.map((d) => {
        let value = data_city.find((e) => d.city_ibge_code === e.codigo_ibge);
        return { ...d, ...value };
      });
    });
  main
    .variable(observer("data_city"))
    .define("data_city", ["d3"], function (d3) {
      return d3.csv(
        "https://raw.githubusercontent.com/kelvins/Municipios-Brasileiros/master/csv/municipios.csv",
        (d) => (d.codigo_uf === "41" ? d : null)
      );
    });
  main
    .variable(observer("data_covid"))
    .define("data_covid", ["d3"], async function (d3) {
      return await d3.csv(
        "https://brasil.io/dataset/covid19/caso?format=csv",
        (d) => {
          d["latitude"] = +d["latitude"];
          d["longitude"] = +d["longitude"];
          d["confirmed"] = +d["confirmed"];
          d["deaths"] = +d["deaths"];

          return d.place_type === "city" && d.city_ibge_code != "" ? d : null;
        }
      );
    });
  main
    .variable(observer("data_with_holes_not_used"))
    .define(
      "data_with_holes_not_used",
      ["d3array", "data_city_covid"],
      function (d3array, data_city_covid) {
        return Array.from(d3array.group(data_city_covid, (d) => d.date))
          .map((d) => d[1])
          .sort((a, b) => a.date - b.date)
          .reverse();
      }
    );
  main.variable(observer("places")).define("places", function () {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Curitiba" },
          geometry: { type: "Point", coordinates: [-49.2646, -25.4195] },
        },
        {
          type: "Feature",
          properties: { name: "Maringá" },
          geometry: { type: "Point", coordinates: [-51.9333, -23.4205] },
        },
        {
          type: "Feature",
          properties: { name: "Cascavel" },
          geometry: { type: "Point", coordinates: [-53.459, -24.9573] },
        },
        {
          type: "Feature",
          properties: { name: "Foz do Iguaçu" },
          geometry: { type: "Point", coordinates: [-54.5827, -25.5427] },
        },
        {
          type: "Feature",
          properties: { name: "Londrina" },
          geometry: { type: "Point", coordinates: [-51.1691, -23.304] },
        },
      ],
    };
  });
  main
    .variable(observer("recentData"))
    .define("recentData", ["data"], function (data) {
      return data[data.length - 1];
    });
  main
    .variable(observer("dates"))
    .define("dates", ["data_covid", "parseDate"], function (
      data_covid,
      parseDate
    ) {
      return data_covid
        .map((item) => item.date)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((d) => parseDate(d))
        .reverse();
    });
  main
    .variable(observer("parseDate"))
    .define("parseDate", ["d3"], function (d3) {
      return d3.utcParse("%Y-%m-%d");
    });
  main
    .variable(observer("dateExtent"))
    .define("dateExtent", ["d3", "data_covid", "parseDate"], function (
      d3,
      data_covid,
      parseDate
    ) {
      return d3.extent(data_covid, (r) => parseDate(r.date));
    });
  main
    .variable(observer("estado"))
    .define("estado", ["topojson", "brasil"], function (topojson, brasil) {
      return topojson.feature(brasil, brasil.objects["41"]);
    });
  main
    .variable(observer("path"))
    .define("path", ["d3", "projection"], function (d3, projection) {
      return d3.geoPath().projection(projection);
    });
  main.variable(observer("brasil")).define("brasil", ["d3"], function (d3) {
    return d3.json("/pr.json");
  });
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("View", child2);
  main
    .variable(observer("topojson"))
    .define("topojson", ["require"], function (require) {
      return require("topojson-client@3");
    });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return require("d3@5", "d3-geo-voronoi");
  });
  main
    .variable(observer("d3array"))
    .define("d3array", ["require"], function (require) {
      return require("d3-array@^2.4");
    });
  return main;
}
