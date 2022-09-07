import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";
import numeral from "numeral";

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const options = {
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
                label: function (tooltipItem, data) {
                    return numeral(tooltipItem.formattedValue).format("+0,0");
                },
            },
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: "cases",
            },
            ticks: {
                display: false,
            },
        },
        y: {
            grid: { display: false },
            min: 0,
            title: {
                display: false,
            },
            ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                    return numeral(value).format("0a");
                },
            },
        },
    },

    elements: {
        point: {
            radius: 0,
        },
        line: {
            fill: true,
        },
    },
};

function LineGraph({ casesType = "cases" }) {
    const [data, setData] = useState({});

    const buildChartData = (data, casesType = "cases") => {
        const chartData = [];
        let lastDataPoint;

        for (let date in data.cases) {
            if (lastDataPoint) {
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint,
                };

                chartData.push(newDataPoint);
            }

            lastDataPoint = data[casesType][date];
        }

        return chartData;
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetch(
                "https://disease.sh/v3/covid-19/historical/all?lastdays=120"
            )
                .then((response) => response.json())
                .then((data) => {
                    const chartData = buildChartData(data, casesType);
                    setData(chartData);
                });
        };

        fetchData();
    }, [casesType]);

    return (
        <div>
            {data?.length > 0 && (
                <Line
                    options={options}
                    data={{
                        datasets: [
                            {
                                label: "world cases",
                                backgroundColor: "rgba(204, 16, 52, 0.5)",
                                borderColor: "#CC1034",
                                data: data,
                            },
                        ],
                    }}
                />
            )}
        </div>
    );
}

export default LineGraph;
