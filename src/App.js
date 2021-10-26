import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import { sortData, prettyPrintStat } from "./Components/utilies";
import numeral from "numeral";
import InfoBox from "./Components/InfoBox/InfoBox";
import LineGraph from "./Components/LineGraph";
import Map from "./Components/CovidMap/CovidMap";
import Table from "./Components/Table/Table";
import "leaflet/dist/leaflet.css";
import "./index.css";
import "./Components/Table/Table.css";
import "./Components/Modal/Modal.css"


const App = () => {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("WorldWide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [center, setCenter] = useState([40.4, -3.7]);
  const [zoom, setZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState(`cases`);


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("http://disease.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const apiCountries = data.map((c) => (
            {
              name: c.country,
              value: c.countryInfo.iso2
            }
          ))
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(apiCountries);
          setMapCountries(data);
        })
    }
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === "WorldWide"
      ? `https://disease.sh/v3/covid-19/all`
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(res => res.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "WorldWide") {
          setZoom(3);
          setCenter([40.4, -3.7]);
        } else {
          setZoom(8);
          setCenter([data.countryInfo.lat, data.countryInfo.long]);

        }
      })
  }
  return (
    <div className="App">
      <div className="left_app">
        <div className="app_header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app_dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}>
              <MenuItem key={"w"} value="WorldWide">WorldWide</MenuItem>
              {
                countries.map((v, i) => (
                  <MenuItem key={i} value={v.value}>{v.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType('cases')}
            title="Coronavirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={numeral(countryInfo.cases).format(0.0)} />
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title="Recovered" cases={prettyPrintStat(countryInfo.todayRecovered)} total={numeral(countryInfo.recovered).format(0.0)} />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={numeral(countryInfo.deaths).format(0.0)} />
        </div>
        <div>
          <Map
            countries={mapCountries}
            casesType={casesType}
            center={center}
            zoom={zoom}
          />
        </div>
      </div>

      <Card className="right_app">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <div className="table">
            <Table countries={tableData} />
          </div>
          <div className="newCase">
            <h3>{country} {casesType.charAt(0).toUpperCase() + casesType.slice(1)} Report</h3>
            <LineGraph casesType={casesType} countryCode={country} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default App;
