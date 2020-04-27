// https://observablehq.com/@bernaferrari/brazil-coronavirus-daily-cases-map-covid-19-not-working@1638
import define1 from "../shared_d3/scrubber.js";
import define2 from "../shared_d3/inputs.js";
import * as d3 from "d3";
import * as d3array from "d3-array";
import * as topojson from "topojson-client";
import { getDataCityCovid, parseDataCityCovid, getMapFrom } from "../../utils/fetcher.ts";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md", "dates"], function (md, dates) {
    return (
      md`# Brazil Coronavirus Daily Cases Map (COVID-19)

Dados entre: ${dates[0].toLocaleDateString()} e ${dates[dates.length - 1].toLocaleDateString()}.

*Fonte: [covid19-br](https://brasil.io/api/dataset/covid19)*`
    )
  });
  main.variable(observer("viewof confirmed_or_deaths")).define("viewof confirmed_or_deaths", ["radio"], function (radio) {
    return (
      radio({
        options: [
          { label: "casos", value: "confirmed" },
          { label: "mortes", value: "deaths" },
        ],
        value: "confirmed",
      })
    )
  });
  main.variable(observer("confirmed_or_deaths")).define("confirmed_or_deaths", ["Generators", "viewof confirmed_or_deaths"], (G, _) => G.input(_));
  main.variable(observer("viewof scale")).define("viewof scale", ["radio"], function (radio) {
    return (
      radio({
        options: [
          { label: "bolhas", value: "bolhas" },
          { label: "espinhos", value: "espinhos" },
        ],
        value: "espinhos",
      })
    )
  });
  main.variable(observer("scale")).define("scale", ["Generators", "viewof scale"], (G, _) => G.input(_));
  main.variable(observer("viewof day")).define("viewof day", ["Scrubber", "dates", "delay"], function (Scrubber, dates, delay) {
    return (
      Scrubber(dates.slice(0, dates.length), {
        delay,
        loop: false,
        format: d => d.toLocaleDateString()
      })
    )
  });
  main.variable(observer("day")).define("day", ["Generators", "viewof day"], (G, _) => G.input(_));
  main.variable(observer("map")).define("map", ["d3", "w", "h", "provinces", "path", "recentData", "confirmed_or_deaths", "scale", "projection", "colorScale", "radius", "breakpoint", "maxRadius", "legendRadii", "numFormat", "sFormat", "DOM", "showSubtitles", "places", "html", "delay", "data"], function (d3, w, h, provinces, path, recentData, confirmed_or_deaths, scale, projection, colorScale, radius, breakpoint, maxRadius, legendRadii, numFormat, sFormat, DOM, showSubtitles, places, html, delay, data) {
    const svg = d3
      .create("svg")
      .attr("viewBox", [0, 0, w, h])
      .attr("class", "italy");

    svg
      .selectAll(".subunit")
      .data(provinces.features)
      .enter()
      .append("path")
      .attr("class", "subunit")
      .attr("d", path);

    let bubble;
    let espinho;
    let yScale = d3.scaleSqrt([0, d3.max(recentData, d => d[confirmed_or_deaths])], [0, 80])

    if (scale === "bolhas") {
      bubble = svg
        .selectAll(".bubble")
        .data(recentData)
        .enter()
        .append("circle")
        .attr("transform", function (d) {
          return "translate(" + projection([d.longitude, d.latitude]) + ")";
        })
        .attr("class", "bubble")
        .attr("fill-opacity", 0.5)
        .attr("fill", d => colorScale(d[confirmed_or_deaths]))
        .attr("r", d => radius(d[confirmed_or_deaths]));

      bubble.append("title");

      const legend = svg
        .append("g")
        .attr("class", "legend")
        .attr("fill", "#777")
        .attr(
          "transform",
          `translate(${w > breakpoint ? [10, h - 25] : [10, h - 25]})`
        );

      legend
        .append("text")
        .attr("class", "legend-title")
        .text("No. casos confirmados")
        .attr("dy", -maxRadius * 3.0);

      const legendBubbles = legend
        .selectAll("g")
        .data(legendRadii)
        .join("g");

      let margin = 0;
      legendBubbles
        .attr("transform", (d, i) => {
          margin += i === 0 ? 0 : radius(legendBubbles.data()[i - 1]) * 2 + 15;
          return `translate(${margin + radius(d)}, 0)`;
        })
        .append("circle")
        .attr("class", "legend-bubble")
        .attr("fill", d => colorScale(d))
        .attr("cy", d => -radius(d))
        .attr("r", radius);

      legendBubbles
        .append("text")
        .attr("dy", "1.3em")
        .text(w > breakpoint ? numFormat : sFormat);
    } else {
      const gradient = DOM.uid();

      espinho = svg
        .selectAll("polyline")
        .data(recentData)
        .enter()
        .append("polyline")
        .attr("class", "polyline")
        .attr("id", d => d.id)
        .attr("points", d => {
          const _d = recentData.find(dd => dd.city_ibge_code === d.city_ibge_code);
          const h = (_d !== undefined) ? yScale(_d[confirmed_or_deaths]) : 0;
          const projectionxy = projection([d.longitude, d.latitude]);
          const x = projectionxy[0];
          const y = projectionxy[1];
          return `${x - 4},${y} ${x},${y - h} ${x + 4},${y}`;
        })
        .attr("stroke", d => colorScale(+d[confirmed_or_deaths]))
        .attr("fill", gradient);

      const colors = d3.scaleOrdinal([100, 0], ['#f3f3f3', '#cc0000'])

      const gg = svg.append("linearGradient")
        .attr("id", gradient.id)
        .attr("x1", '0%')
        .attr("y1", '0%')
        .attr("x2", '0%')
        .attr("y2", '100%')
        .selectAll("stop")
        .data([0, 100])
        .join("stop")
        .attr("offset", d => `${d}%`)
        .attr("stop-color", d => colors(d));
    }

    let label;

    if (showSubtitles) {
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

      label = svg
        .selectAll(".place-label")
        .data(places.features)
        .enter()
        .append("text")
        .attr("class", "place-label")
        .style('paint-order', 'stroke')
        .style('stroke-width', '3')
        .style('stroke', 'rgba(255,255,255,.85)')
        .style('stroke-linecap', 'round')
        .style('stroke-linejoin', 'round')
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

      label.append("tspan")
        .attr("class", "additionalnum")
        .style('font-weight', 'bold')
        .attr("x", d => label.x)
        .attr("y", d => label.y)
        .text(d => {
          return " (" + recentData.find(dd => dd.city === d.properties.name)[confirmed_or_deaths] + ")";
        });
    }

    const wrapper = html`<div class="wrapper"></div>`;
    wrapper.append(svg.node());

    return Object.assign(wrapper, {
      update(i) {
        const t = svg
          .transition()
          .duration(i === 0 ? 0 : delay)
          .ease(d3.easeLinear);

        let currentData = data[i];

        if (showSubtitles) {
          label.select("tspan")
            .text(d => " (" + currentData.find(dd => dd.city === d.properties.name)[confirmed_or_deaths] + ")");
        }

        if (scale === "bolhas") {
          bubble
            .data(currentData)
            .call(b => {
              b.transition(t)
                .attr("fill", d => colorScale(d[confirmed_or_deaths]))
                .attr("r", d => radius(d[confirmed_or_deaths]));
            })
            .select("title")
            .text(
              d =>
                `${d.city}: ${numFormat(d[confirmed_or_deaths])}`
            );
        } else {
          espinho
            .data(currentData)
            .call(b => {
              b.transition(t)
                .attr("points", d => {
                  const _d = currentData.find(dd => dd.city_ibge_code === d.city_ibge_code);
                  const h = (_d !== undefined) ? yScale(_d[confirmed_or_deaths]) : 0;
                  const projectionxy = projection([d.longitude, d.latitude]);
                  const x = projectionxy[0];
                  const y = projectionxy[1];
                  return `${x - 4},${y} ${x},${y - h} ${x + 4},${y}`
                }).attr("display", d => d[confirmed_or_deaths] === 0 ? "none" : "inline");
            })
            .select("title")
            .text(
              d =>
                `${d.city}: ${numFormat(+d[confirmed_or_deaths])} casos`
            );
        }
      }
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
  fill: rgba(0,0,0,0.8);
  stroke: none;
}
.place-label, .legend-title {
  font-weight: bold;
  font-size: 13px;
  fill: rgba(0,0,0,0.8);
}
.place-label {
  text-shadow: ${c} 1px 0px 0px, ${c} 0.540302px 0.841471px 0px, ${c} -0.416147px 0.909297px 0px, ${c} -0.989992px 0.14112px 0px, ${c} -0.653644px -0.756802px 0px, ${c} 0.283662px -0.958924px 0px, ${c} 0.96017px -0.279415px 0px;
}
.bubble, .legend-bubble {
  stroke-width: 0.8;
  stroke: rgba(0,0,0,0.3)
}
.bubble:hover {
  stroke: rgba(0,0,0,0.6);
  stroke-width: 1.2;
  cursor: crosshair;
}
.legend text {
  fill: #000;
}
.legend-bubble {
  stroke: rgba(0,0,0,0.4);
}
.legend-title {
  text-anchor: start;
}
</style>`;
  }
  );
  main.variable(observer("legendRadii")).define("legendRadii", ["maxCases"], function (maxCases) {
    return (
      [maxCases / 8, maxCases / 4, maxCases / 2, maxCases].map(d => Math.round(d))
    )
  });
  main.variable(observer("draw")).define("draw", ["map", "index"], function (map, index) {
    map.update(index);
  }
  );
  main.variable(observer("w")).define("w", ["width"], function (width) {
    return (
      Math.min(width, 700)
    )
  });
  main.variable(observer("h")).define("h", function () {
    return (
      500
    )
  });
  main.variable(observer("maxLegend")).define("maxLegend", ["maxCases"], function (maxCases) {
    return (
      maxCases
    )
  });
  main.variable(observer("toMagnitude")).define("toMagnitude", function () {
    return (
      function toMagnitude(n) {
        var order = Math.floor(Math.log(n) / Math.LN10 + 0.000000001);
        return Math.pow(10, order);
      }
    )
  });
  main.define("initial index", function () {
    return (
      0
    )
  });
  main.variable(observer("mutable index")).define("mutable index", ["Mutable", "initial index"], (M, _) => new M(_));
  main.variable(observer("index")).define("index", ["mutable index"], _ => _.generator);
  main.variable(observer("indexSetter")).define("indexSetter", ["mutable index", "dates", "day"], function ($0, dates, day) {
    $0.value = dates.indexOf(day);
  }
  );
  main.variable(observer("radius")).define("radius", ["d3", "maxCases", "maxRadius"], function (d3, maxCases, maxRadius) {
    return (
      d3
        .scaleSqrt()
        .domain([0, maxCases])
        .range([0, maxRadius])
    )
  });
  main.variable(observer("colorScale")).define("colorScale", ["d3", "maxCases"], function (d3, maxCases) {
    return (
      d3
        .scaleSqrt()
        .domain([0, maxCases])
        .range([`hsla(57, 100%, 50%, 0.36)`, `hsla(7, 100%, 50%, 0.57)`])
    )
  });
  main.variable(observer("delay")).define("delay", function () {
    return (
      100
    )
  });
  main.variable(observer("maxCases")).define("maxCases", ["d3", "data_city_covid", "confirmed_or_deaths"], function (d3, data_city_covid, confirmed_or_deaths) {
    return (
      d3.max(data_city_covid.map(d => d[confirmed_or_deaths]))
    )
  });
  main.variable(observer("data_city_covid")).define("data_city_covid", async function () {
    return await getDataCityCovid(null, null);
  });
  main.variable(observer("data")).define("data", ["data_city_covid", "grouped_data"], async function (data_city_covid, grouped_data) {
    return await parseDataCityCovid(data_city_covid, grouped_data);
  });
  main.variable(observer("grouped_data")).define("grouped_data", ["data_city_covid"], function (data_city_covid) {
    return d3array.group(data_city_covid, (d) => d.rawDate);
  });
  main.variable(observer("breakpoint")).define("breakpoint", function () {
    return 500;
  });
  main.variable(observer("maxRadius")).define("maxRadius", ["w", "breakpoint"], function (w, breakpoint) {
    return (
      w > breakpoint ? 30 : 18
    )
  });
  main.variable(observer("recentData")).define("recentData", ["data"], function (data) {
    return (
      [...data[data.length - 1]]
    )
  });
  main.variable(observer("dates")).define("dates", ["grouped_data", "parseDate"], function (grouped_data, parseDate) {
    let keys = [];
    for (let [key] of grouped_data.entries()) {
      keys.push(key);
    }
    return keys.map(d => parseDate(d)).reverse();
  });
  main.variable(observer("parseDate")).define("parseDate", ["d3"], function (d3) {
    return (
      d3.timeParse("%Y-%m-%d")
    )
  });
  main.variable(observer("dateExtent")).define("dateExtent", ["d3", "data_city_covid", "parseDate"], function (d3, data_city_covid, parseDate) {
    return (
      d3.extent(data_city_covid, r => parseDate(r.date))
    )
  });
  main.variable(observer("provinces")).define("provinces", ["topojson", "brasil"], function (topojson, brasil) {
    return (
      topojson.feature(brasil, brasil.objects.Brasil)
    )
  });
  main.variable(observer("sFormat")).define("sFormat", ["d3"], function (d3) {
    return (
      d3.format(".1s")
    )
  });
  main.variable(observer("numFormat")).define("numFormat", ["d3"], function (d3) {
    return (
      d3.format(",")
    )
  });
  main.variable(observer("path")).define("path", ["d3", "projection"], function (d3, projection) {
    return (
      d3.geoPath().projection(projection)
    )
  });
  main.variable(observer("showSubtitles")).define("showSubtitles", ["w"], function (w) {
    return (
      w > 600
    )
  });
  main.variable(observer("projection")).define("projection", ["d3", "showSubtitles", "w", "h", "provinces"], function (d3, showSubtitles, w, h, provinces) {
    return (
      d3.geoMercator()
        .fitExtent([[20, 0], [showSubtitles ? (w - 60) : w - 20, h]], provinces)
    )
  });
  main.variable(observer("topCities")).define("topCities", ["recentData", "confirmed_or_deaths"], function (recentData, confirmed_or_deaths) {
    return (
      [...recentData].sort((a, b) => b[confirmed_or_deaths] - a[confirmed_or_deaths]).slice(0, 5)
    )
  });
  main.variable(observer("places")).define("places", function () {
    return (
      {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: { name: "Curitiba" },
            geometry: { type: "Point", coordinates: [-49.2646, -25.4195] }
          },
          {
            type: "Feature",
            properties: { name: "São Paulo" },
            geometry: { type: "Point", coordinates: [-46.6395, -23.5329] }
          },
          // {
          //   type: "Feature",
          //   properties: { name: "Rio de Janeiro" },
          //   geometry: { type: "Point", coordinates: [-43.2003, -22.9129] }
          // },
          {
            type: "Feature",
            properties: { name: "Fortaleza" },
            geometry: { type: "Point", coordinates: [-38.5423, -3.71664] }
          },
          {
            type: "Feature",
            properties: { name: "Manaus" },
            geometry: { type: "Point", coordinates: [-60.0212, -3.11866] }
          },
          {
            type: "Feature",
            properties: { name: "Brasília" },
            geometry: { type: "Point", coordinates: [-47.9297, -15.7795] }
          },
          {
            type: "Feature",
            properties: { name: "Recife" },
            geometry: { type: "Point", coordinates: [-34.8771, -8.04666] }
          },
          {
            type: "Feature",
            properties: { name: "Salvador" },
            geometry: { type: "Point", coordinates: [-38.5011, -12.9718] }
          },
          {
            type: "Feature",
            properties: { name: "Porto Alegre" },
            geometry: { type: "Point", coordinates: [-51.2065, -30.0318] }
          },
          {
            type: "Feature",
            properties: { name: "Belo Horizonte" },
            geometry: { type: "Point", coordinates: [-43.9266, -19.9102] }
          },
        ]
      }
    )
  });
  main.variable(observer("brasil")).define("brasil", async function () {
    return await getMapFrom("br");
  });
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  const child2 = runtime.module(define2);
  main.import("radio", child2);
  main.variable(observer("topojson")).define("topojson", topojson);
  main.variable(observer("d3")).define("d3", d3);
  return main;
}
