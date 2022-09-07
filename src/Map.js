import React from "react";
import "./Map.css";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { showDataOnMap } from "./util";

function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

function Map({ countries, casesType, center, zoom }) {
    return (
        <div className="map">
            <LeafletMap center={center} zoom={zoom}>
                <ChangeView center={center} zoom={zoom} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(countries, casesType)}
                {/* Loop through countries and draw circles on the screen */}
            </LeafletMap>
        </div>
    );
}

export default Map;
