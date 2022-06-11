import React, { useEffect, useState } from 'react';
import {FormControl, MenuItem, Select, Card, CardContent} from "@material-ui/core";
import Map from './Map';
import Infobox from './Infobox';
import './App.css';
import LinedGraph from './LinedGraph';
import Table from './Table';
import { SortData, prettyPrintStat } from './util';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34, lng: -40});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setcasesType] = useState("cases");

  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data =>{
      setCountryInfo(data);
    });
  },[]);

  useEffect(() => {
    const getCountriesData = async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
          const countries = data.map((country)=>({
              name:country.country,
              value:country.countryInfo.iso2
            }));
            const sortdata = SortData(data);
            setTableData(sortdata);
            setCountries(countries);
            setMapCountries(data);
      });
    }
    getCountriesData();
  },[]);

  const OnCountryChange = async (event) => {
    const countryCode = event.target.value;
 
    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response => response.json())
    .then(data =>{
      setCountry(countryCode);
      setCountryInfo(data);
      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(5);    
    });
  };

  return (
    <div className="app">
      <div className="app_left">
        <div className="app_header">
            <h1>COVID-19 TRACKER</h1>
            <FormControl className="app_dropdown">
              <Select variant="outlined" onChange={OnCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) =>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
              </Select>
            </FormControl>
          </div>
          <div className="app_stats">
            <Infobox 
              isRed
              active = {casesType === "cases"}
              onClick={e => setcasesType('cases')}
              title="Coronavirus Cases" 
              cases={prettyPrintStat(countryInfo.todayCases)} 
              total={prettyPrintStat(countryInfo.cases)} />
            <Infobox 
              active = {casesType === "recovered"}
              onClick={e => setcasesType('recovered')}
              title="Recovered" 
              cases={prettyPrintStat(countryInfo.todayRecovered)} 
              total={prettyPrintStat(countryInfo.recovered)}/>
            <Infobox 
              isRed
              active = {casesType === "deaths"}
              onClick={e => setcasesType('deaths')}
              title="Deaths" 
              cases={prettyPrintStat(countryInfo.todayDeaths)} 
              total={prettyPrintStat(countryInfo.deaths)}/>
          </div>
          <Map 
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
      </div>
      <Card className="app_right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} /><br></br>
            <h3 className="app_graphTitle">Worldwide new {casesType}</h3><br></br>
            <LinedGraph className="app_graph" casesType={casesType}/>
          </CardContent>
      </Card>
    </div>
  );
}

export default App;