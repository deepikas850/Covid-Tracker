import React, { useEffect, useState } from 'react'
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import 'chartjs-adapter-moment';
//Line.defaults.global.legend.display = false;

const options = {
    plugins:{
        legend: {
        display: false,
        },
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
      x: 
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      
      y: 
        {
        //   gridLines: {
        //     display: false,
        //   },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");
              
            },
          },
        },
      
    },
  };
  

const buildChartData = (data,casesType = "cases") =>{
    let chartData = [];
    let lastDataPoint;
    for(let date in data.cases){
        if(lastDataPoint){
            let newData = {
                x:date,
                y:data[casesType][date]-lastDataPoint//getting difference in number of cases bw 2 dates
            }
            chartData.push(newData);
        }
        lastDataPoint = data[casesType][date];
    };
    return chartData;
}

function LinedGraph({casesType = "cases", ...props}) {
    const [data,setData] = useState({});

    useEffect(()=>{
        const fetchData = async() =>{
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then(response => {return response.json()})
            .then(data => {
                let chartData = buildChartData(data,casesType);
                setData(chartData);
                // console.log(chartData);
            });
        }
        fetchData();
    }, [casesType]);

    return (
        <div className={props.className}>
        {/* data? checks that data exists or not..if it doesnt it results whole as undefined...data && data.length = data?.length */}
        {data?.length>0 && (
            <Line 
            data={{
                datasets:[{
                    backgroundColor:"rgba(204, 16, 52, 0.5)",
                    borderColor: "#CC1034",
                    fill:true,
                    data:data,
                }],
            }}
            options={options}
            />
        )}
        </div>
    )
}

export default LinedGraph;
