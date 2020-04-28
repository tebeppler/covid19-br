// https://observablehq.com/@bernaferrari/parana-coronavirus-daily-cases-map-covid-19@2389
import define1 from "../shared_d3/scrubber.js";
import define2 from "../shared_d3/inputs.js";
import define3 from "./colorlegend.js";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { parseDataCityCovid, getDataCityCovid, getMapFrom } from "../../utils/fetcher.ts";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md", "dates"], function (md, dates) {
    return md`# Paraná Coronavirus Daily Cases Map (COVID-19)

Dados entre: ${dates[0].toLocaleDateString()} e ${dates[dates.length - 1].toLocaleDateString()}.

*Fonte: [covid19-br](https://brasil.io/api/dataset/covid19)*`;
  });
  main
    .variable(observer("viewof confirmed_or_deaths"))
    .define("viewof confirmed_or_deaths", ["radio"], function (radio) {
      return radio({
        options: [
          { label: "casos", value: "confirmed" },
          { label: "mortes", value: "deaths" },
        ],
        value: "deaths",
      });
    });
  main.variable(observer("confirmed_or_deaths")).define("confirmed_or_deaths", ["Generators", "viewof confirmed_or_deaths"], (G, _) => G.input(_));
  main.variable(observer("viewof day")).define("viewof day", ["Scrubber", "dates", "delay"], function (Scrubber, dates, delay) {
    return (
      Scrubber(dates.slice(0, dates.length), {
        delay,
        loop: false,
        format: d => d.toLocaleDateString()
      })
    )
  });
  main
    .variable(observer("day"))
    .define("day", ["Generators", "viewof day"], (G, _) => G.input(_));
  main
    .variable(observer("colorlegend"))
    .define(
      "colorlegend",
      ["confirmed_or_deaths", "legend", "colorScaleFilled"],
      function (confirmed_or_deaths, legend, colorScaleFilled) {
        if (confirmed_or_deaths === "confirmed") {
          return legend({
            color: colorScaleFilled,
            title: "Casos confirmados",
            ticks: 3,
          });
        } else if (confirmed_or_deaths === "deaths") {
          return legend({
            color: colorScaleFilled,
            title: "Mortes",
            ticks: 3,
          });
        }
      }
    );
  main
    .variable(observer("colorScaleFilled"))
    .define(
      "colorScaleFilled",
      ["d3", "confirmed_or_deaths", "maxCases"],
      function (d3, confirmed_or_deaths, maxCases) {
        return d3
          .scaleSequentialSqrt(
            confirmed_or_deaths === "confirmed"
              ? d3.interpolateYlGnBu
              : d3.interpolateYlOrRd
          )
          .domain([0, maxCases]);
      }
    );
  main
    .variable(observer("map_spike"))
    .define(
      "map_spike",
      [
        "d3",
        "w",
        "h",
        "statesOuter",
        "path",
        "estado",
        "currentData",
        "confirmed_or_deaths",
        "colorScaleFilled",
        "places",
        "projection",
        "html",
      ],
      function (
        d3,
        w,
        h,
        statesOuter,
        path,
        estado,
        currentData,
        confirmed_or_deaths,
        colorScaleFilled,
        places,
        projection,
        html
      ) {
        const svg = d3
          .create("svg")
          .attr("viewBox", [0, 0, w, h])
          .attr("class", "italy");

        svg
          .append("path")
          .datum(statesOuter)
          .attr("class", "outer")
          .attr("d", path)
          .attr("id", "prFilledPath")
          .attr("stroke", "grey")
          .attr("stroke-width", "1px");

        svg
          .selectAll(".subunitpr")
          .data(estado.features)
          .enter()
          .append("path")
          .attr("stroke", "#BBB")
          .style("stroke-width", (d) => {
            let find = currentData.find(
              (dd) => dd.city_ibge_code === d.properties.cod
            );
            let value = find !== undefined ? find[confirmed_or_deaths] : 0;
            return value > 0 ? "0px" : "0.25px";
          })
          .attr("fill", (d) => {
            let find = currentData.find(
              (dd) => dd.city_ibge_code == d.properties.cod
            );
            let value = find !== undefined ? find[confirmed_or_deaths] : 0;
            // return value > 0 ? colorScaleFilled(value) : "#fff";
            return colorScaleFilled(value);
          })
          .attr("d", path)
          .append("title")
          .text((d) => {
            let find = currentData.find(
              (dd) => dd.city_ibge_code == d.properties.cod
            );
            //               data_city.find(dd => dd.codigo_ibge == d.properties.cod).name
            let value =
              find !== undefined
                ? `${find.city}: ${find[confirmed_or_deaths]}`
                : "0";
            return value;
          });

        svg
          .selectAll("place")
          .data(places.features)
          .enter()
          .append("circle")
          // .attr("class", "place")
          .attr("r", 2.5)
          .attr("fill", "#fff")
          .attr("stroke", "#000")
          .attr("transform", function (d) {
            return "translate(" + projection(d.geometry.coordinates) + ")";
          });

        let label = svg
          .selectAll(".place-label")
          .data(places.features)
          .enter()
          .append("text")
          .attr("class", "place-label2")
          .style("paint-order", "stroke")
          .style("stroke-width", "3")
          .style("stroke", "rgba(255,255,255,.85)")
          .style("stroke-linecap", "round")
          .style("stroke-linejoin", "round")
          .attr("transform", function (d) {
            return "translate(" + projection(d.geometry.coordinates) + ")";
          })
          .attr("dy", ".35em")
          .text(function (d) {
            return d.properties.name;
          })
          .attr("pointer-events", "none")
          .attr("x", function (d) {
            return d.geometry.coordinates[0] > -1 ? -6 : 6;
          })
          .style("text-anchor", function (d) {
            return d.geometry.coordinates[0] < -1 ? "start" : "end";
          });

        label
          .append("tspan")
          .attr("class", "additionalnum")
          .style("font-weight", "bold")
          .attr("x", (d) => label.x)
          .attr("y", (d) => label.y)
          .text((d) => {
            const findedValue = currentData.find((dd) => dd.city === d.properties.name);
            const showValue = (findedValue !== undefined) ? findedValue[confirmed_or_deaths] : 0
            return ` (${showValue})`;
          });

        const wrapper = html`<div class="wrapper"></div>`;
        wrapper.append(svg.node());
        return wrapper;
      }
    );
  main
    .variable(observer("currentData"))
    .define("currentData", ["data", "index"], function (data, index) {
      return data[index];
    });
  main
    .variable(observer("viewof scale"))
    .define("viewof scale", ["radio"], function (radio) {
      return radio({
        options: [
          { label: "bolhas", value: "bolhas" },
          { label: "espinhos", value: "espinhos" },
        ],
        value: "bolhas",
      });
    });
  main
    .variable(observer("scale"))
    .define("scale", ["Generators", "viewof scale"], (G, _) => G.input(_));
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
        "breakpoint",
        "maxRadius",
        "legendRadii",
        "radius",
        "colorScale",
        "numFormat",
        "sFormat",
        "estado",
        "recentData",
        "projection",
        "confirmed_or_deaths",
        "places",
        "html",
        "delay",
        "data",
      ],
      function (
        d3,
        w,
        h,
        statesOuter,
        path,
        breakpoint,
        maxRadius,
        legendRadii,
        radius,
        colorScale,
        numFormat,
        sFormat,
        estado,
        recentData,
        projection,
        confirmed_or_deaths,
        places,
        html,
        delay,
        data
      ) {
        const svg = d3
          .create("svg")
          // .attr("width", w)
          // .attr("height", h)
          .attr("viewBox", [0, 0, w, h])
          .attr("class", "italy");

        svg
          .append("path")
          .datum(statesOuter)
          .attr("class", "outer")
          .attr("d", path)
          .attr("id", "prFilledPath")
          .style("fill", "white")
          .attr("stroke", "grey");

        const legend = svg
          .append("g")
          .attr("class", "legend")
          .attr("fill", "#777")
          .attr(
            "transform",
            `translate(${
            w > breakpoint ? [w - w / 4.9, h / 3.5] : [10, h - 15]
            })`
          );

        legend
          .append("text")
          .attr("class", "legend-title")
          .text("No. casos confirmados")
          .attr("dy", -maxRadius * 2.5);

        const legendBubbles = legend.selectAll("g").data(legendRadii).join("g");

        let margin = 0;
        legendBubbles
          .attr("transform", (d, i) => {
            margin +=
              i === 0 ? 0 : radius(legendBubbles.data()[i - 1]) * 2 + 15;
            return `translate(${margin + radius(d)}, 0)`;
          })
          .append("circle")
          .attr("class", "legend-bubble")
          .attr("fill", (d) => colorScale(d))
          .attr("cy", (d) => -radius(d))
          .attr("r", radius);

        legendBubbles
          .append("text")
          .attr("dy", "1.3em")
          .text(w > breakpoint ? numFormat : sFormat);

        svg
          .selectAll(".subunit")
          .data(estado.features)
          .enter()
          .append("path")
          .attr("class", "subunit")
          .attr("fill", "#f4f4f4")
          .attr("stroke", "#999")
          .attr("stroke-width", "0.5")
          .attr("d", path);

        const bubble = svg
          .selectAll(".bubble")
          .data(recentData)
          .enter()
          .append("circle")
          .attr("transform", function (d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
          })
          .attr("class", "bubble")
          .attr("fill-opacity", 0.5)
          .attr("fill", (d) => colorScale(+d[confirmed_or_deaths]))
          .attr("r", (d) => radius(+d[confirmed_or_deaths]));

        bubble.append("title");

        svg
          .selectAll("place")
          .data(places.features)
          .enter()
          .append("circle")
          .attr("class", "place")
          .attr("r", 2.5)
          .attr("transform", function (d) {
            return "translate(" + projection(d.geometry.coordinates) + ")";
          });

        svg
          .selectAll(".place-label")
          .data(places.features)
          .enter()
          .append("text")
          .attr("class", "place-label")
          .attr("transform", function (d) {
            return "translate(" + projection(d.geometry.coordinates) + ")";
          })
          .attr("dy", ".35em")
          .text(function (d) {
            return d.properties.name;
          })
          .attr("x", function (d) {
            return d.geometry.coordinates[0] > -1 ? -6 : 6;
          })
          .style("text-anchor", function (d) {
            return d.geometry.coordinates[0] < -1 ? "start" : "end";
          });

        const wrapper = html`<div class="wrapper"></div>`;
        wrapper.append(svg.node());

        return Object.assign(wrapper, {
          update(i) {
            const t = svg
              .transition()
              .duration(i === 0 ? 0 : delay)
              .ease(d3.easeLinear);

            bubble
              .data(data[i])
              .call((b) => {
                b.transition(t)
                  .attr("fill", (d) => colorScale(+d[confirmed_or_deaths]))
                  .attr("r", (d) => radius(+d[confirmed_or_deaths]));
              })
              .select("title")
              .text(
                (d) => `${d.city}: ${numFormat(+d[confirmed_or_deaths])} casos`
              );
          },
        });
      }
    );
  main.variable(observer("style")).define("style", ["html"], function (html) {
    const c = `rgb(255, 255, 255, 0.5)`;
    return html`<style>
      .wrapper {
        text-align: center;
      }
      .italy {
        text-anchor: middle;
        font-family: sans-serif;
        font-size: 10px;
        margin: 0 auto;
      }
      .place {
        fill: rgba(0, 0, 0, 0.8);
        stroke: none;
      }
      .place-label,
      .legend-title {
        font-weight: bold;
        font-size: 13px;
        fill: rgba(0, 0, 0, 0.8);
      }
      .place-label {
        text-shadow: ${c} 1px 0px 0px, ${c} 0.540302px 0.841471px 0px,
          ${c} -0.416147px 0.909297px 0px, ${c} -0.989992px 0.14112px 0px,
          ${c} -0.653644px -0.756802px 0px, ${c} 0.283662px -0.958924px 0px,
          ${c} 0.96017px -0.279415px 0px;
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
          [20, 0],
          [w - 20, h],
        ],
        estado
      );
    });
  main.variable(observer("showSubtitles")).define("showSubtitles", function () {
    return false;
  });
  main.variable(observer("legendRadii")).define("legendRadii", function () {
    return [10, 100, 250];
  });
  main.define("initial index", function () {
    return 0;
  });
  main
    .variable(observer("mutable index"))
    .define("mutable index", ["Mutable", "initial index"], (M, _) => new M(_));
  main
    .variable(observer("index"))
    .define("index", ["mutable index"], (_) => _.generator);
  main
    .variable(observer("draw"))
    .define("draw", ["map", "index"], function (map, index) {
      map.update(index);
    });
  main.variable(observer("w")).define("w", ["width"], function (width) {
    return Math.min(width, 700);
  });
  main.variable(observer("h")).define("h", ["width"], function (width) {
    return Math.min(width, 400);
  });
  main
    .variable(observer("maxLegend"))
    .define("maxLegend", ["maxCases", "magnitude"], function (
      maxCases,
      magnitude
    ) {
      return Math.round(maxCases / magnitude) * magnitude;
    });
  main
    .variable(observer("magnitude"))
    .define("magnitude", ["toMagnitude", "maxCases"], function (
      toMagnitude,
      maxCases
    ) {
      return toMagnitude(maxCases);
    });
  main.variable(observer("toMagnitude")).define("toMagnitude", function () {
    return function toMagnitude(n) {
      var order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001);
      return Math.pow(10, order);
    };
  });
  main
    .variable(observer("indexSetter"))
    .define("indexSetter", ["mutable index", "dates", "day"], function (
      $0,
      dates,
      day
    ) {
      $0.value = dates.indexOf(day);
    });
  main
    .variable(observer("radius"))
    .define("radius", ["d3", "maxCases", "maxRadius"], function (
      d3,
      maxCases,
      maxRadius
    ) {
      return d3.scaleSqrt().domain([0, maxCases]).range([0, maxRadius]);
    });
  main
    .variable(observer("colorScale"))
    .define("colorScale", ["d3", "maxCases"], function (d3, maxCases) {
      return d3
        .scaleSqrt()
        .domain([0, maxCases])
        .range([`hsla(57, 100%, 50%, 0.36)`, `hsla(7, 100%, 50%, 0.57)`]);
    });
  main.variable(observer("delay")).define("delay", function () {
    return 100;
  });
  main
    .variable(observer("maxCases"))
    .define(
      "maxCases",
      ["d3", "data", "confirmed_or_deaths"],
      function (d3, data, confirmed_or_deaths) {
        return d3.max(data.flat(), d => d[confirmed_or_deaths]);
      }
    );
  main
    .variable(observer("data"))
    .define("data", ["data_city_covid"], async function (
      data_city_covid
    ) {
      return await parseDataCityCovid(data_city_covid, false);
    });
  main
    .variable(observer("data_city_covid"))
    .define("data_city_covid", [], async function (
    ) {
      return await getDataCityCovid("41", "PR");
    });
  main.variable(observer("breakpoint")).define("breakpoint", function () {
    return 500;
  });
  main
    .variable(observer("maxRadius"))
    .define("maxRadius", ["w", "breakpoint"], function (w, breakpoint) {
      return w > breakpoint ? 30 : 18;
    });
  main
    .variable(observer("topCities"))
    .define("topCities", ["recentData", "confirmed_or_deaths"], function (
      recentData,
      confirmed_or_deaths
    ) {
      return recentData
        .sort((a, b) => b[confirmed_or_deaths] - a[confirmed_or_deaths])
        .slice(0, 5);
    });
  main
    .variable(observer("places"))
    .define("places", ["topCities", "estado"], function (topCities, estado) {
      let topCitiesFlat = topCities.map((d) => d.city_ibge_code);
      let updatedArray = [];
      for (var i = 0; i < estado.features.length; i++) {
        let flatIndex = topCitiesFlat.indexOf(
          estado.features[i].properties.cod
        );
        if (flatIndex > -1) {
          let features = { ...estado.features[i] };
          features.properties = {
            name: topCities[flatIndex].city,
            city_ibge_code: topCities[flatIndex].city_ibge_code,
          };
          features.geometry = {
            type: "Point",
            coordinates: [
              topCities[flatIndex].longitude,
              topCities[flatIndex].latitude,
            ],
          };
          updatedArray.push(features);
        }
      }

      return {
        type: "FeatureCollection",
        features: updatedArray,
      };
    });
  main
    .variable(observer("recentData"))
    .define("recentData", ["data"], function (data) {
      return data[data.length - 1];
    });
  main
    .variable(observer("dates"))
    .define("dates", ["data_city_covid", "parseDate"], function (
      data_city_covid,
      parseDate
    ) {
      return data_city_covid
        .map(d => d.rawDate)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map(d => parseDate(d))
        .reverse();
    });
  main
    .variable(observer("parseDate"))
    .define("parseDate", ["d3"], function (d3) {
      return d3.timeParse("%Y-%m-%d");
    });
  main.variable(observer("dateExtent"))
    .define("dateExtent", ["d3", "data_city_covid", "parseDate"], function (d3, data_city_covid, parseDate) {
      return (
        d3.extent(data_city_covid, r => parseDate(r.date))
      )
    });
  main
    .variable(observer("estado"))
    .define("estado", ["topojson", "brasil"], function (topojson, brasil) {
      return topojson.feature(brasil, brasil.objects["41"]);
    });
  main
    .variable(observer("statesOuter"))
    .define("statesOuter", ["topojson", "brasil"], function (topojson, brasil) {
      return topojson.feature(brasil, brasil.objects["41"]);
    });
  main
    .variable(observer("statesInner"))
    .define("statesInner", ["topojson", "brasil"], function (topojson, brasil) {
      return topojson.mesh(brasil, brasil.objects["41"], (a, b) => a === b);
    });
  main.variable(observer("sFormat")).define("sFormat", ["d3"], function (d3) {
    return d3.format(".1s");
  });
  main
    .variable(observer("numFormat"))
    .define("numFormat", ["d3"], function (d3) {
      return d3.format(",");
    });
  main
    .variable(observer("path"))
    .define("path", ["d3", "projection"], function (d3, projection) {
      return d3.geoPath().projection(projection);
    });
  main.variable(observer("brasil")).define("brasil", async function () {
    return await getMapFrom("pr");
  });
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("radio", child2);
  const child3 = runtime.module(define3);
  main.import("legend", child3);
  main.variable(observer("topojson")).define("topojson", topojson);
  main.variable(observer("d3")).define("d3", d3);
  return main;
}
