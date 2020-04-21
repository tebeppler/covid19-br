// https://observablehq.com/@bernaferrari/parana-coronavirus-daily-cases-map-covid-19@1801
import define1 from "../shared_d3/scrubber.js";
import define2 from "../shared_d3/syncviews.js";
import { getCovidCSV, dataCityCovid } from "../../utils/fetcher.ts";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md", "dates"], function (md, dates) {
    return md`# Paraná Coronavirus Daily Cases Map (COVID-19)

Dados entre: ${dates[0].toLocaleDateString()} e ${dates[dates.length - 1].toLocaleDateString()}.

*Fonte: [covid19-br](https://brasil.io/api/dataset/covid19)*`;
  });
  main
    .variable(observer())
    .define(["viewof scale", "html"], function ($0, html) {
      return $0.bind(html`<select
        style="font-size:1em;font-family:serif;margin:0 4px"
      >
        <option>bolhas </option
        ><option>espinhos </option
        ><option>preenchido </option></select
      >`);
    });
  main
    .variable(observer("viewof day"))
    .define("viewof day", ["Scrubber", "dates", "delay"], function (
      Scrubber,
      dates,
      delay
    ) {
      return Scrubber(dates.slice(0, dates.length), {
        delay,
        loop: false,
        format: (d) => d.toLocaleDateString(),
      });
    });
  main
    .variable(observer("day"))
    .define("day", ["Generators", "viewof day"], (G, _) => G.input(_));
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
          .attr("id", "usPath")
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
          .attr("fill", (d) => colorScale(+d.confirmed))
          .attr("r", (d) => radius(+d.confirmed));

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
                  .attr("fill", (d) => colorScale(+d.confirmed))
                  .attr("r", (d) => radius(+d.confirmed));
              })
              .select("title")
              .text((d) => `${d.city}: ${numFormat(+d.confirmed)} casos`);
          },
        });
      }
    );
  main.variable(observer("style")).define("style", ["html"], function (html) {
    const c = `rgb(255, 255, 255, 0.5)`;
    return html`<style>
      form output {
        font-weight: bold;
        font-size: 14px;
      }
      .wrapper {
        text-align: center;
      }
      .italy {
        text-anchor: middle;
        font-family: sans-serif;
        font-size: 10px;
        margin: 0 auto;
      }
      .subunit {
        fill: #f4f4f4;
        stroke: #999;
        stroke-width: 0.5;
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
      .bubble,
      .legend-bubble {
        stroke-width: 0.8;
        stroke: rgba(0, 0, 0, 0.3);
      }
      .bubble:hover {
        stroke: rgba(0, 0, 0, 0.6);
        stroke-width: 1.2;
        cursor: crosshair;
      }
      .legend text {
        fill: #000;
      }
      .legend-bubble {
        stroke: rgba(0, 0, 0, 0.4);
      }
      .legend-title {
        text-anchor: start;
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
          [40, 0],
          [w - 40, h],
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
    .variable(observer("viewof scale"))
    .define("viewof scale", ["View"], function (View) {
      return new View("espinhos");
    });
  main
    .variable(observer("scale"))
    .define("scale", ["Generators", "viewof scale"], (G, _) => G.input(_));
  main
    .variable(observer("colorScale"))
    .define("colorScale", ["d3", "maxCases"], function (d3, maxCases) {
      return d3
        .scaleSqrt()
        .domain([0, maxCases])
        .range([`hsla(57, 100%, 50%, 0.36)`, `hsla(7, 100%, 50%, 0.57)`]);
    });
  main.variable(observer("delay")).define("delay", function () {
    return 250;
  });
  main
    .variable(observer("maxCases"))
    .define("maxCases", ["d3", "data_city_covid"], function (
      d3,
      data_city_covid
    ) {
      return d3.max(data_city_covid.map((d) => +d.confirmed));
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
    .define("data_city_covid", [], async function () {
      return await dataCityCovid();
    });
  main.variable(observer("breakpoint")).define("breakpoint", function () {
    return 600;
  });
  main
    .variable(observer("maxRadius"))
    .define("maxRadius", ["w", "breakpoint"], function (w, breakpoint) {
      return w > breakpoint ? 30 : 18;
    });
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
    .define("dates", ["data_city_covid"], function (
      data_city_covid
    ) {
      return data_city_covid
        .map((item) => item.date)
        .filter((value, index, self) => self.indexOf(value) === index)
        .reverse();
    });
  main
    .variable(observer("dateExtent"))
    .define("dateExtent", ["d3", "data_city_covid"], function (
      d3,
      data_city_covid
    ) {
      return d3.extent(data_city_covid, (r) => r.date);
    });
  main
    .variable(observer("estado"))
    .define("estado", ["topojson", "brasil"], function (topojson, brasil) {
      return topojson.feature(brasil, brasil.objects["41"]);
    });
  main
    .variable(observer("statesOuter"))
    .define("statesOuter", ["topojson", "brasil"], function (topojson, brasil) {
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
      return require("./node_modules/topojson-client@3");
    });
  main.variable(observer("d3")).define("d3", ["require"], function (require) {
    return require("d3@5", "d3-geo-voronoi");
  });
  main
    .variable(observer("d3array"))
    .define("d3array", ["require"], function (require) {
      return require("./node_modules/d3-array@^2.4");
    });
  return main;
}
