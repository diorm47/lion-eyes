import "leaflet/dist/leaflet.css";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import marker from "../../assets/marker.png";
import "./select-map.css";

const center = [51.505, -0.09];

function DisplayPosition({ map, setSelected }) {
  const [position, setPosition] = useState(() => map.getCenter());

  const onClick = useCallback(() => {
    map.setView(center, 13);
  }, [map]);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    setSelected(position);
  }, [position, setSelected]);

  useEffect(() => {
    map.on("move", onMove);

    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  return (
    <p>
      lat: {position.lat.toFixed(4)}, lon: {position.lng.toFixed(4)}
    </p>
  );
}

function SelectMap() {
  const [map, setMap] = useState(null);
  const [selected, setSelected] = useState([]);

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <div className="center_marker">
          <img src={marker} alt="" />
        </div>
      </MapContainer>
    ),
    []
  );

  return (
    <div>
      {map ? <DisplayPosition map={map} setSelected={setSelected} /> : null}
      {displayMap}
    </div>
  );
}

export default SelectMap;
