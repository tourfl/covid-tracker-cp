import { useState, useEffect } from "react";
import "./App.css";

import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import numeral from "numeral";
import "leaflet/dist/leaflet.css";
import { sortData, prettyPrintStat } from "./util";
import InfoBox from "./InfoBox";
import Table from "./Table";
import Map from "./Map";
import LineGraph from "./LineGraph";

function App() {
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [disabledSelect, setDisabledSelect] = useState(false);
  const [mapCenter, setMapCenter] = useState([45.003838, 6.31369]);
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  // USEEFFECT = Runs a piece of code based on a given condition

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    // The code inside here will run once when the component loads and not again, but also when input changes
    // async -> send a request, wait for it, do something with it
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // France
            value: country.countryInfo.iso2, // FR
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setDisabledSelect(true);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([45.004615, 6.308377]);
          setMapZoom(2);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });

    setDisabledSelect(false);
  };

  console.log("reloading");

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID 19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              disabled={disabledSelect}
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            color="red"
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={"+" + prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0,0")}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={"+" + prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0,0")}
          />
          <InfoBox
            color="black"
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={"+" + prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0,0")}
          />
          {/* InfoBoxes title="Coronavirus cases" */}
          {/* InfoBoxes title="Coronavirus recoveries */}
          {/* InfoBoxes */}
        </div>
        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <h3>Total Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
