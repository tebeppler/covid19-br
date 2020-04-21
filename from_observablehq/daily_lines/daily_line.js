// https://observablehq.com/@bernaferrari/covid-no-brasil-25-2-2020-5-4-2020@920
import define1 from "../shared_d3/inputs.js";
import { getCovidCSV } from "../../utils/fetcher.ts";
import * as d3 from "d3";
import * as d3array from "d3-array";

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md", "x"], function (md, x) {
    return (
      md`# Crescimento do COVID-19 no Brasil

Dados entre: ${x.domain().map(d => d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()).join(" - ")}

Fonte: [covid19-br](https://brasil.io/api/dataset/covid19)`
    )
  });
  main.variable(observer("viewof indicator")).define("viewof indicator", ["radio"], function (radio) {
    return (
      radio({
        options: [
          { label: "casos", value: "confirmed" },
          { label: "mortes", value: "deaths" },
          { label: "casos por 100 mil habitantes", value: "confirmed_per_100k_inhabitants" },
        ],
        value: "confirmed",
      })
    )
  });
  main.variable(observer("indicator")).define("indicator", ["Generators", "viewof indicator"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3", "w", "height", "colors", "x", "xAxis", "yAxis", "grid", "data", "line", "hover"], function (d3, w, height, colors, x, xAxis, yAxis, grid, data, line, hover) {
    const svg = d3.create("svg")
      .attr("viewBox", [0, 0, w, height])
      .style("overflow", "visible");

    const array = ["S", "SE", "CO", "NE", "N"];
    const extendedNames = ["Sul", "Sudeste", "Centro-Oeste", "Nordeste", "Norte"];

    var bar = svg.selectAll("g")
      .data(array)
      .enter()
      .append("g")
      .attr("transform", function (d, i) { return "translate(100," + (1 + i) * 28 + ")"; });

    bar.append("rect")
      .attr("width", 22)
      .attr("height", 22)
      .attr("x", -28)
      .attr("y", 14).style("fill", (d, i) => colors[array.indexOf(d)]);

    bar.append("text")
      .attr("y", 52 / 2)
      .attr("dy", ".35em")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .text(function (d, i) { return extendedNames[i]; });

    svg.append("g")
      .call(xAxis);

    svg.append("g")
      .call(yAxis);

    svg.append("g")
      .call(grid);

    const path = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", d3.rgb("#e54b4b"))
      .attr("stroke-width", 2)
      .attr("stroke-miterlimit", 1)
      .selectAll("path")
      .data(data.series)
      .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", d => line(d.values));

    svg.call(hover, { path, focus: "PR" });

    return svg.node();
  }
  );
  main.variable(observer("data_from_csv")).define("data_from_csv", ["d3"], async function (d3) {
    return (
      (await getCovidCSV()).filter(d => d.place_type === "state")
    )
  });
  main.variable(observer("data")).define("data", ["data_from_csv", "d3", "indicator"], function (data_from_csv, d3, indicator) {
    const data = data_from_csv;
    const parseDate = d3.utcParse("%Y-%m-%d");
    const dates = Array.from(d3array.group(data, d => d.date).keys(), parseDate).sort(d3.ascending);
    const bisectDate = d3.bisector(d => parseDate(d.date));

    let yStr;
    if (indicator === "confirmed_per_100k_inhabitants") {
      yStr = "Casos por 100 mil habitantes";
    } else if (indicator === "confirmed") {
      yStr = "Casos confirmados";
    } else {
      yStr = "Óbitos";
    }

    return {
      y: yStr,
      series: d3array.groups(data, d => d.state).map(([name, group]) => {

        // group needs to be sorted for bisect to work.
        const updatedGroup = group.sort(function (x, y) {
          return d3.ascending(parseDate(x.date), parseDate(y.date));
        })

        return {
          name,
          values: dates.map(date => {
            const i = bisectDate.left(updatedGroup, date);
            return i <= 0 ? 0 : +group[i - 1][indicator];
          })
        };
      }),
      dates
    };
  }
  );
  main.variable(observer("retrieveStateRegion")).define("retrieveStateRegion", function () {
    const state = {
      AC: "N",
      AL: "NE",
      AP: "N",
      AM: "N",
      BA: "NE",
      CE: "NE",
      DF: "CO",
      ES: "SE",
      GO: "CO",
      MA: "NE",
      MT: "CO",
      MS: "CO",
      MG: "SE",
      PA: "N",
      PB: "NE",
      PR: "S",
      PE: "NE",
      PI: "NE",
      RJ: "SE",
      RN: "NE",
      RS: "S",
      RO: "N",
      RR: "N",
      SC: "S",
      SP: "SE",
      SE: "NE",
      TO: "N"
    }

    return state
  }
  );
  main.variable(observer("colors")).define("colors", function () {
    return (
      ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6"]
    )
  });
  main.variable(observer("colorForState")).define("colorForState", ["retrieveStateRegion", "colors"], function (retrieveStateRegion, colors) {
    return (
      function colorForState(state) {
        const region = retrieveStateRegion[state];
        const states = ["S", "SE", "CO", "N", "NE"];
        const index = states.indexOf(region);
        return colors[index];
      }
    )
  });
  main.variable(observer("hover")).define("hover", ["colorForState", "x", "data", "y", "indicator", "margin", "d3"], function (colorForState, x, data, y, indicator, margin, d3) {
    return (
      function hover(svg, { path, focus }) {

        if ("ontouchstart" in document) svg
          .style("-webkit-tap-highlight-color", "transparent")
          .on("touchstart", moved)
          .on("touchend", left)
        else svg
          .on("mousemove mouseenter", moved)
          .on("mouseleave", left);

        const dot = svg.append("g");

        dot.append("circle")
          .attr("r", 2.5);

        dot.append("text")
          .attr("font-family", "sans-serif")
          .attr("font-weight", "600")
          .attr("font-size", "12px")
          .style('paint-order', 'stroke')
          .style('stroke-width', '3')
          .style('stroke', 'rgba(255,255,255,.85)')
          .style('stroke-linecap', 'round')
          .style('stroke-linejoin', 'round')
          .style('paint-order', 'stroke')
          .attr("stroke-width", "0.4px")
          .attr("text-anchor", "middle")
          .attr("y", -12);

        function hover(s, i) {
          path.attr("stroke", d => {
            return d === s ? "#555555" : colorForState(d.name);
            // return d.name === focus ? "#1d91c0" : d === s ? null : 
            // colorForState(d.name) //"#d0d0d0"
          });
          dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);

          let indicatorValue;
          if (indicator === "confirmed_per_100k_inhabitants") {
            indicatorValue = s.values[i].toFixed(2);
          } else {
            indicatorValue = s.values[i];
          }

          dot.select("text").text(`${s.name}: ${indicatorValue}`);
        }

        function moved() {
          d3.event.preventDefault();
          const ym = y.invert(d3.event.offsetY);  // for some reason this is need. LayerY might be 800 (if view is down). Offset works.
          const xm = x.invert(d3.event.offsetX);
          const i1 = d3.bisectLeft(data.dates, xm, 1);
          const i0 = i1 - 1;
          const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
          const s = d3array.least(data.series, d => Math.abs(d.values[i] - ym));
          hover(s, i);
        }

        function left() {
          const i = data.dates.length - 1;
          const s = data.series.find(s => s.name === focus);
          hover(s, i);
        }

        left();
      }
    )
  });
  main.variable(observer("height")).define("height", function () {
    return (
      document.getElementById("externalDivForDaily").clientHeight
    )
  });
  main.variable(observer("w")).define("w", ["width"], function (width) {
    return (
      document.getElementById("externalDivForDaily").clientWidth
    )
  });
  main.variable(observer("margin")).define("margin", function () {
    return (
      { top: 40, right: 40, bottom: 40, left: 40 }
    )
  });
  main.variable(observer("x")).define("x", ["d3", "data", "margin", "w"], function (d3, data, margin, w) {
    return (
      d3.scaleUtc()
        .domain(d3.extent(data.dates))
        .range([margin.left, w - margin.right])
    )
  });
  main.variable(observer("y")).define("y", ["d3", "data", "height", "margin"], function (d3, data, height, margin) {
    return (
      d3.scaleLinear()
        .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
        .range([height - margin.bottom, margin.top])
    )
  });
  main.variable(observer("xAxis")).define("xAxis", ["height", "margin", "d3", "x", "w"], function (height, margin, d3, x, w) {
    return (
      g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(w / 90).tickSizeOuter(0))
    )
  });
  main.variable(observer("yAxis")).define("yAxis", ["margin", "d3", "y", "data"], function (margin, d3, y, data) {
    return (
      g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
          .attr("x", -margin.left)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(data.y))
    )
  });
  main.variable(observer("line")).define("line", ["d3", "x", "data", "y"], function (d3, x, data, y) {
    return (
      d3.line()
        .defined(d => !isNaN(d))
        .x((d, i) => x(data.dates[i]))
        .y(d => y(d))
    )
  });
  main.variable(observer("grid")).define("grid", ["x", "margin", "height", "y", "w"], function (x, margin, height, y, w) {
    return (
      g => g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.05)
        .call(g => g.append("g")
          .selectAll("line")
          .data(x.ticks())
          .join("line")
          .attr("x1", d => 0.5 + x(d))
          .attr("x2", d => 0.5 + x(d))
          .attr("y1", margin.top)
          .attr("y2", height - margin.bottom))
        .call(g => g.append("g")
          .selectAll("line")
          .data(y.ticks())
          .join("line")
          .attr("y1", d => 0.5 + y(d))
          .attr("y2", d => 0.5 + y(d))
          .attr("x1", margin.left)
          .attr("x2", w - margin.right))
    )
  });
  const child1 = runtime.module(define1);
  main.import("radio", child1);
  main.variable(observer("d3")).define("d3", d3);
  return main;
}
