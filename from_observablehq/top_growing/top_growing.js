// https://observablehq.com/d/45a84f2f48ee31a8@2882
import define1 from "../shared_d3/syncviews.js";
import * as d3 from "d3";
import * as d3array from "d3-array";
import { getCovidCSV, cityFromCode } from "../../utils/fetcher.ts";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function (md) {
    return md`
# COVID-19 nas cidades no Brasil`;
  });
  main
    .variable(observer())
    .define(["md", "confirmedByCountryLatestForTable"], function (
      md,
      confirmedByCountryLatestForTable
    ) {
      return md`Situação até ${new Date(
        confirmedByCountryLatestForTable[0].date
      ).toLocaleDateString()}.`;
    });
  main
    .variable(observer("overall"))
    .define(
      "overall",
      [
        "d3",
        "html",
        "width",
        "confirmedByCountryLatestForTable",
        "colors",
        "number",
      ],
      function (
        d3,
        html,
        width,
        confirmedByCountryLatestForTable,
        colors,
        number
      ) {
        const container = d3
          .select(html`<div></div>`)
          .style("font-family", "sans-serif")
          .style("width", `${width}px`)
          .style("text-align", "center");

        const confirmedCases = {
          value: d3.sum(confirmedByCountryLatestForTable, (d) => d.confirmed),
          label: "casos confirmados",
          key: "confirmed",
        };
        const newCases = {
          value: d3.sum(confirmedByCountryLatestForTable, (d) => d.new),
          label: "novos casos confirmados",
          key: "new",
        };
        const deathsCases = {
          value: d3.sum(confirmedByCountryLatestForTable, (d) => d.deaths),
          label: "mortes",
          key: "deaths",
        };
        const date = confirmedByCountryLatestForTable[0].date;

        const board = container
          .selectAll("div")
          .data([confirmedCases, deathsCases, newCases])
          .join("div")
          .style("width", "100px")
          .style("padding", "0 1em")
          .style("line-height", 1.2)
          .style("font-size", ".9em")
          .style("color", "#808080")
          .style("display", "inline-block")
          .style("text-align", "center")
          .style("vertical-align", "top")
          // .style('border-right','1px dotted #BDBDBD')
          .html((d) => {
            return `<span style="font-weight:bold;font-size:1.5em;color:${colors(
              d.key
            )}">${number(d.value)}</span><br/> ${d.label}`;
          });

        return container.node();
      }
    );
  main
    .variable(observer("viewof selectedState"))
    .define("viewof selectedState", ["html", "confirmedRaw"], function (
      html,
      confirmedRaw
    ) {
      return html`<select
        >${Array.from(new Set(confirmedRaw.flat().map((row) => row.state)))
          .sort()
          .map(
            (state) =>
              '<option value="' +
              state +
              '"' +
              (state === "PR" ? " selected" : "") +
              ">" +
              state +
              "</option>"
          )}
      </select>`;
    });
  main
    .variable(observer("selectedState"))
    .define("selectedState", ["Generators", "viewof selectedState"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("table"))
    .define(
      "table",
      ["width", "d3", "html", "dataFacets", "number", "drawChart", "drawStack"],
      function (width, d3, html, dataFacets, number, drawChart, drawStack) {
        let w = document.getElementById("externalDiv").clientWidth;

        const rows = w / 150 > 4 ? 4 : 2;
        const padding = 4;
        const chartWidth = w / rows - padding * 2;
        const chartHeight = chartWidth * 0.25;

        const container = d3
          .select(html`<div></div>`)
          .style("font-family", "sans-serif");

        const facets = container
          .selectAll("div")
          .data(dataFacets.show)
          .join("div")
          .style("width", `${chartWidth}px`)
          .style("display", "inline-block")
          .style("text-align", "left")
          .style("background", "#fff")
          .style("margin", `0 ${padding}px ${padding}px 0`)
          .style(
            "padding",
            `${padding * 2}px ${padding}px ${padding}px ${padding}px`
          );

        facets
          .append("h4")
          .style("font-size", ".9em")
          .style("font-weight", "bold")
          .html((d) => cityFromCode[d[d.length - 1].city_ibge_code]);

        facets
          .append("p")
          .style("font-size", ".8em")
          .style("color", "#808080")
          .style("margin-bottom", 0)
          .html(
            (d) =>
              `<span style="font-size:1.2em;font-weight:bold;color:#ff9500">${number(
                d[d.length - 1].confirmed
              )}</span> casos confirmados`
          );

        facets
          .append("p")
          .style("font-size", ".8em")
          .style("color", "#808080")
          .style("margin-bottom", 0)
          .html(
            (d) =>
              `<span style="font-size:1.2em;font-weight:bold;color:#c9166a">${number(
                d[d.length - 1].deaths
              )}</span> mortes`
          );

        const chartsTop = facets
          .append("svg")
          .attr("viewBox", [
            0,
            -1,
            chartWidth,
            2 * chartHeight + padding * 2 + 12,
          ]);

        const chartsConf = chartsTop.append("g");

        const chartsDR = chartsTop.append("g");

        drawChart(
          chartsConf,
          "confirmed",
          "#ff9500",
          chartWidth,
          2 * chartHeight,
          padding
        );
        drawStack(chartsDR, chartWidth, 2 * chartHeight, padding);

        // facets.append('p')
        //   .style('font-size', '.8em')
        //   .style('color', '#808080')
        //   .style('margin-bottom', 0)
        //   .html(d =>
        //     `<span style="font-size:1.2em;font-weight:bold">+${number(d[d.length - 1].new)}</span> novos casos em ${new Date(d[d.length - 1].date).toLocaleDateString()}`
        //   );

        const chartsNew = facets
          .append("svg")
          .attr("viewBox", [0, -1, chartWidth, chartHeight + padding * 2 + 12]);

        drawChart(
          chartsNew,
          "new",
          "#808080",
          chartWidth,
          chartHeight,
          padding
        );

        facets
          .append("p")
          .style("font-size", ".7em")
          .style("color", "#999")
          .style("margin-bottom", 0)
          .style("line-height", 1.2)
          .html(
            (d) =>
              `A <span style="color:#505050; font-weight: bold">linha cinza grossa</span> mostra a média semanal dos casos diários`
          );

        return container.node();
      }
    );
  main.variable(observer("colors")).define("colors", ["d3"], function (d3) {
    return d3
      .scaleOrdinal()
      .domain(["recovered", "deaths", "confirmed", "new"])
      .range(["#25c45b", "#c9166a", "#ff9500", "#808080"]);
  });
  main
    .variable(observer("dataFacets"))
    .define("dataFacets", ["allTimeseries", "order"], function (
      allTimeseries,
      order
    ) {
      const obj = {};

      var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let limit;
      if (isMobile) {
        limit = 4;
      } else {
        limit = 8;
      }

      obj.confirmed = allTimeseries
        .sort((a, b) => b[b.length - 1].confirmed - a[a.length - 1].confirmed)
        .slice(0, limit);

      obj.deaths = allTimeseries
        .sort((a, b) => b[b.length - 1].deaths - a[a.length - 1].deaths)
        .slice(0, limit);

      obj.new = allTimeseries
        .sort((a, b) => b[b.length - 1].new - a[a.length - 1].new)
        .slice(0, limit);

      if (order === "confirmed cases") obj.show = obj.confirmed;
      else if (order === "new daily cases") obj.show = obj.new;
      else if (order === "deaths") obj.show = obj.deaths;
      else obj.show = obj.confirmed;

      return obj;
    });
  main
    .variable(observer("stackedDeathsAndRecovered"))
    .define(
      "stackedDeathsAndRecovered",
      ["confirmedByCountryTimeseries", "d3"],
      function (confirmedByCountryTimeseries, d3) {
        return confirmedByCountryTimeseries.map((d) =>
          d3.stack().keys(["deaths", ""])(d)
        );
      }
    );
  main
    .variable(observer("allTimeseries"))
    .define(
      "allTimeseries",
      ["confirmedByCountryTimeseries", "stackedDeathsAndRecovered"],
      function (confirmedByCountryTimeseries, stackedDeathsAndRecovered) {
        return confirmedByCountryTimeseries.map((d) => {
          const city = d[0].city_ibge_code;
          d.stack = stackedDeathsAndRecovered.find(
            (d) => d[0][0].data.city_ibge_code === city
          );
          return d;
        });
      }
    );
  main
    .variable(observer("confirmedMovingAvg"))
    .define(
      "confirmedMovingAvg",
      ["confirmedByCountryTimeseries", "movAvg"],
      function (confirmedByCountryTimeseries, movAvg) {
        return confirmedByCountryTimeseries.map((d) => movAvg(d, "new"));
      }
    );
  main
    .variable(observer("confirmedByCountryTimeseries"))
    .define(
      "confirmedByCountryTimeseries",
      ["confirmedWithNew", "d3"],
      function (confirmedWithNew, d3) {
        confirmedWithNew.flat();

        const byCountry = Array.from(
          d3array.group(confirmedWithNew.flat(), (d) => `${d.city_ibge_code}`),
          ([key, value]) => value
        );

        let addNew = byCountry.map((d) =>
          d.map((dd, i) => {
            dd.new = i > 0 ? dd.confirmed - d[i - 1].confirmed : 0;
            return dd;
          })
        );

        return addNew.map((d) => d.sort((a, b) => a.date - b.date));
      }
    );
  main
    .variable(observer("confirmedUSLatest"))
    .define("confirmedUSLatest", ["d3", "confirmedRaw"], function (
      d3,
      confirmedRaw
    ) {
      const data = Array.from(
        d3array.group(confirmedRaw, (d) => d.date),
        ([key, value]) => value
      )
        .sort((a, b) => b.date - a.date)
        .reverse();

      const _data = data
        .filter((d, i) => i === data.length - 1)
        .flat()
        .sort((a, b) => b.confirmed - a.confirmed);

      return _data;
    });
  main
    .variable(observer("deathsLatest"))
    .define("deathsLatest", ["confirmedRaw"], function (confirmedRaw) {
      return confirmedRaw
        .map((d) => d[d.length - 1])
        .sort((a, b) => b.deaths - a.deaths);
    });
  main
    .variable(observer("confirmedLatest"))
    .define("confirmedLatest", ["confirmedRaw"], function (confirmedRaw) {
      return confirmedRaw
        .map((d) => d[d.length - 1])
        .sort((a, b) => b.confirmed - a.confirmed);
    });
  main
    .variable(observer("confirmedWithNew"))
    .define("confirmedWithNew", ["confirmedRaw", "selectedState"], function (
      confirmedRaw,
      selectedState
    ) {
      return confirmedRaw.map((d) =>
        d.filter((dd) => dd.state === selectedState && dd.city_ibge_code > 100)
      );
    });
  main
    .variable(observer("confirmedRaw"))
    .define("confirmedRaw", ["d3"], async function (d3) {
      const dd = (await getCovidCSV()).filter(
        (d) => (d.place_type === "c" || d.place_type === "city" || d.state === "PR") && d.city_ibge_code != ""
      );

      dd.forEach(function (d) {
        d.confirmed = +d.confirmed;
        d.deaths = +d.deaths;
      });

      let data_with_holes = Array.from(
        d3array.group(dd, (d) => d.date),
        ([key, value]) => value
      )
        .sort((a, b) => a.date - b.date)
        .reverse();

      let mutableArray = [...data_with_holes].filter(function (el) {
        return el != null;
      });

      for (let i = 1; i < data_with_holes.length; i++) {
        for (let j = 0; j < mutableArray[i - 1].length; j++) {
          let found = mutableArray[i].find(
            (element) =>
              element.city_ibge_code === mutableArray[i - 1][j].city_ibge_code
          );
          if (found !== undefined) {
            continue;
          }

          let newCase = { ...data_with_holes[i - 1][j] };
          newCase.date = data_with_holes[i][0].date;
          mutableArray[i].push(newCase);
        }
      }

      return mutableArray;
    });
  main
    .variable(observer("confirmedByCountryLatestForTable"))
    .define(
      "confirmedByCountryLatestForTable",
      ["confirmedByCountryTimeseries"],
      function (confirmedByCountryTimeseries) {
        return confirmedByCountryTimeseries.map((d) => d[d.length - 1]);
      }
    );
  main.variable(observer()).define(["md"], function (md) {
    return md`
### Libraries and utility functions

We used **D3** for the data transformations and visualization, and **topojson** for all map-related operations.`;
  });
  main.variable(observer("d3")).define("d3", d3);
  main.variable(observer()).define(["md"], function (md) {
    return md`
Everything else is maps, chart-drawing functions, scales, formats and lookup lists to keep country names consistent.`;
  });
  main
    .variable(observer("viewof order"))
    .define("viewof order", ["View"], function (View) {
      return new View("confirmed cases");
    });
  main
    .variable(observer("order"))
    .define("order", ["Generators", "viewof order"], (G, _) => G.input(_));
  main.variable(observer("movAvg")).define("movAvg", ["d3"], function (d3) {
    return function movAvg(data, accessor, window = 7) {
      const tArray = [...new Array(Math.floor(data.length))];

      const means = tArray.map((d, i) => {
        const w = i + window < data.length ? window : data.length - i;
        const sums = d3.sum(data.slice(i, i + 7), (d) => d[accessor]);
        const _d = data[i];
        _d.weeklyAvg = sums / w;
        return _d;
      });

      return means;
    };
  });
  main
    .variable(observer("drawStack"))
    .define(
      "drawStack",
      ["yScale", "xScale", "d3", "date", "colors"],
      function (yScale, xScale, d3, date, colors) {
        return function drawStack(svg, w, h, padding) {
          yScale.range([h, 0]);
          xScale.range([0, w]);

          const area = d3
            .area()
            .x((d) => xScale(date(d.data.date)))
            .y0((d) => yScale(d[0]))
            .y1((d) => yScale(d[1]))
            .curve(d3.curveStepBefore);

          const g = svg.append("g");

          g.selectAll("path")
            .data((d) => {
              yScale.domain([0, d3.max(d, (dd) => dd.confirmed)]);
              d.stack[0].y = yScale.domain();
              d.stack[1].y = yScale.domain();
              return d.stack;
            })
            .join("path")
            .attr("d", (d) => {
              yScale.domain(d.y);
              return area(d);
            })
            .attr("fill", ({ key }) => colors(key));
        };
      }
    );
  main
    .variable(observer("drawChart"))
    .define("drawChart", ["yScale", "xScale", "d3", "date"], function (
      yScale,
      xScale,
      d3,
      date
    ) {
      return function drawChart(svg, data, color, w, h, padding) {
        yScale.range([h, 0]);
        xScale.range([0, w]);

        const area = d3
          .area()
          .x((d) => xScale(date(d.date)))
          .y0((d) => yScale(d[data]))
          .y1(h)
          .curve(d3.curveStepBefore);

        const line = d3
          .line()
          .x((d) => xScale(date(d.date)))
          .y((d) => yScale(d[data]))
          .curve(d3.curveStepBefore);

        const avg = d3
          .line()
          .x((d) => xScale(date(d.date)))
          .y((d) => yScale(d.weeklyAvg))
          .curve(d3.curveCardinal);

        const xAxis = d3.axisBottom(xScale).ticks(3);

        const g = svg.append("g");

        g.append("path")
          .attr("d", (d) => {
            yScale.domain([
              0,
              d3.max(d, (d) => d[data === "new" ? "new" : "confirmed"]),
            ]);
            return area(d);
          })
          .attr("fill", color)
          .attr(
            "fill-opacity",
            data === "new" || data === "confirmed" ? 0.2 : 1
          );

        g.append("path")
          .attr("d", (d) => {
            yScale.domain([
              0,
              d3.max(d, (d) => d[data === "new" ? "new" : "confirmed"]),
            ]);
            return line(d);
          })
          .attr("stroke", color)
          .attr("fill", "none");

        if (data === "new") {
          g.append("path")
            .attr("d", (d) => {
              yScale.domain([0, d3.max(d, (d) => d.new)]);
              return avg(d);
            })
            .attr("stroke", "#505050")
            .attr("stroke-width", 2)
            .attr("fill", "none");
        }

        const xa = g
          .append("g")
          .call(xAxis)
          .attr("transform", `translate(${0},${h})`);

        xa.select(".domain").remove();

        xa.selectAll(".tick text").attr("fill", "#999");

        xa.selectAll(".tick line").attr("stroke", "#999");
      };
    });
  main
    .variable(observer("yScale"))
    .define("yScale", ["d3", "confirmedRaw"], function (d3, confirmedRaw) {
      return d3
        .scaleLinear()
        .domain([0, d3.max(confirmedRaw.flat(), (d) => d.confirmed)]);
    });
  main
    .variable(observer("xScale"))
    .define("xScale", ["d3", "confirmedWithNew", "date"], function (
      d3,
      confirmedWithNew,
      date
    ) {
      return d3
        .scaleTime()
        .domain(d3.extent(confirmedWithNew.flat(), (d) => date(d.date)));
    });
  main.variable(observer("number")).define("number", ["d3"], function (d3) {
    return d3.format(",.2~f");
  });
  main.variable(observer("date")).define("date", ["d3"], function (d3) {
    return d3.utcParse("%Y-%m-%d");
  });
  main
    .variable(observer("threshOrder"))
    .define("threshOrder", ["d3"], function (d3) {
      return d3
        .scaleOrdinal()
        .domain(["confirmed cases", "new daily cases", "deaths"])
        .range([1, 10, 40]);
    });
  const child1 = runtime.module(define1);
  main.import("View", child1);
  return main;
}
