import { Circle, Popup } from "react-leaflet";
import numeral from "numeral";

const casesTypeConfig = {
    cases: {
        hex: "#cc1034",
        multiplier: 80,
    },
    recovered: {
        hex: "#7dd71d",
        multiplier: 80,
    },
    deaths: {
        hex: "#000000",
        multiplier: 800,
    },
};

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        if (a.cases > b.cases) {
            return false;
        } else {
            return true;
        }
    });

    return sortedData;
};

export const prettyPrintStat = (stat) =>
    stat ? `${numeral(stat).format("0.0a")}` : 0;

// Draw circles on the map with interactive tooltip
export const showDataOnMap = (data, casesType = "cases") =>
    data.map((country) => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions={{
                color: casesTypeConfig[casesType].hex,
                fillColor: casesTypeConfig[casesType].hex,
            }}
            radius={
                casesTypeConfig[casesType].multiplier *
                Math.sqrt(country[casesType])
            }
        >
            <Popup>
                <div>
                    <div
                        className="info-flag"
                        style={{
                            backgroundImage: `url(${country.countryInfo.flag})`,
                        }}
                    ></div>
                    <h2>{country.country}</h2>
                    {Object.keys(casesTypeConfig).map((casesType) => (
                        <h3>
                            {casesType}: {prettyPrintStat(country[casesType])}
                        </h3>
                    ))}
                </div>
            </Popup>
        </Circle>
    ));
