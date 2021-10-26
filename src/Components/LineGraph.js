import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import Modal from "./Modal/Modal";
import "./Modal/Modal.css";


const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "lll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function buildChartData(data, casesType) {
  let chartData = [];
  let lastDataPoint;

  for (let date in data[casesType]) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      }
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  };
  return chartData;
}

function LineGraph({ casesType, countryCode }) {
  const [data, setData] = useState({});
  const [showing, SetShowing] = useState(false);
  const [APImessage, SetAPImessage] = useState("");

  let lineUrl = countryCode === "WorldWide"
    ? `https://disease.sh/v3/covid-19/historical/all?lastdays=120    `
    : `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=120`;

  useEffect(() => {
    try {
      const fetchData = async () => {
        await fetch(lineUrl)
          .then(res => { return res.json() })
          .then(data => {
            if (!data.message) {
              if (countryCode === "WorldWide") {
                let chartData = buildChartData(data, casesType);
                return setData(chartData);
              } else {
                let chartData = buildChartData(data.timeline, casesType);
                return setData(chartData);
              }
            } else {
              SetAPImessage(data.message);
              SetShowing(true);
            }

          })
          .catch(error => {
            console.log(`error: Country ${countryCode} is not updated!`);
          })
      }
      fetchData();
    } catch{
      console.log(`error: Country ${countryCode} is not updated!`);
    }
  }, [casesType, lineUrl, countryCode]);

  function toggleElement() {
    SetShowing(false);
  }

  return (
    <div>
      {data.length > 0 && (
        <Line
          data={
            {
              datasets: [
                {
                  data: data,
                  backgroundColor: "rgba(204,16,92,0.1)",
                  borderColor: "#CC1034",
                }
              ]
            }
          }
          options={options}
        />
      )}
      <Modal isShowing={showing} toggleElement={toggleElement} message={APImessage} />
    </div>
  )
}

export default LineGraph


